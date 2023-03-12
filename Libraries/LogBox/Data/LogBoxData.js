/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *  strict
 * @format
 */

('use strict');

import * as React from 'react';
import LogBoxLog from './LogBoxLog';
import {parseLogBoxException} from './parseLogBoxLog';
import parseErrorStack from '../../Core/Devtools/parseErrorStack';
import NativeLogBox from '../../NativeModules/specs/NativeLogBox';







const observers = new Set();
const ignorePatterns = new Set();
let appInfo = null;
let logs = new Set();
let updateTimeout = null;
let _isDisabled = false;
let _selectedIndex = -1;

let warningFilter = function (format) {
  return {
    finalFormat: format,
    forceDialogImmediately: false,
    suppressDialog_LEGACY: true,
    suppressCompletely: false,
    monitorEvent: 'unknown',
    monitorListVersion: 0,
    monitorSampleRate: 1,
  };
};

const LOGBOX_ERROR_MESSAGE =
  'An error was thrown when attempting to render log messages via LogBox.';

function getNextState() {
  return {
    logs,
    isDisabled: _isDisabled,
    selectedLogIndex: _selectedIndex,
  };
}

export function reportLogBoxError(
  error,
  componentStack,
) {
  const ExceptionsManager = require('../../Core/ExceptionsManager');

  error.message = `${LOGBOX_ERROR_MESSAGE}\n\n${error.message}`;
  if (componentStack != null) {
    error.componentStack = componentStack;
  }
  ExceptionsManager.handleException(error, /* isFatal */ true);
}

export function isLogBoxErrorMessage(message) {
  return typeof message === 'string' && message.includes(LOGBOX_ERROR_MESSAGE);
}

export function isMessageIgnored(message) {
  for (const pattern of ignorePatterns) {
    if (
      (pattern instanceof RegExp && pattern.test(message)) ||
      (typeof pattern === 'string' && message.includes(pattern))
    ) {
      return true;
    }
  }
  return false;
}

function handleUpdate() {
  if (updateTimeout == null) {
    updateTimeout = setImmediate(() => {
      updateTimeout = null;
      const nextState = getNextState();
      observers.forEach(({observer}) => observer(nextState));
    });
  }
}

function appendNewLog(newLog) {
  // Don't want store these logs because they trigger a
  // state update when we add them to the store.
  if (isMessageIgnored(newLog.message.content)) {
    return;
  }

  // If the next log has the same category as the previous one
  // then roll it up into the last log in the list by incrementing
  // the count (similar to how Chrome does it).
  const lastLog = Array.from(logs).pop();
  if (lastLog && lastLog.category === newLog.category) {
    lastLog.incrementCount();
    handleUpdate();
    return;
  }

  if (newLog.level === 'fatal') {
    // If possible, to avoid jank, we don't want to open the error before
    // it's symbolicated. To do that, we optimistically wait for
    // sybolication for up to a second before adding the log.
    const OPTIMISTIC_WAIT_TIME = 1000;

    let addPendingLog = () => {
      logs.add(newLog);
      if (_selectedIndex < 0) {
        setSelectedLog(logs.size - 1);
      } else {
        handleUpdate();
      }
      addPendingLog = null;
    };

    const optimisticTimeout = setTimeout(() => {
      if (addPendingLog) {
        addPendingLog();
      }
    }, OPTIMISTIC_WAIT_TIME);

    newLog.symbolicate(status => {
      if (addPendingLog && status !== 'PENDING') {
        addPendingLog();
        clearTimeout(optimisticTimeout);
      } else if (status !== 'PENDING') {
        // The log has already been added but we need to trigger a render.
        handleUpdate();
      }
    });
  } else if (newLog.level === 'syntax') {
    logs.add(newLog);
    setSelectedLog(logs.size - 1);
  } else {
    logs.add(newLog);
    handleUpdate();
  }
}

export function addLog(log) {
  const errorForStackTrace = new Error();

  // Parsing logs are expensive so we schedule this
  // otherwise spammy logs would pause rendering.
  setImmediate(() => {
    try {
      const stack = parseErrorStack(errorForStackTrace?.stack);

      appendNewLog(
        new LogBoxLog({
          level: log.level,
          message: log.message,
          isComponentError: false,
          stack,
          category: log.category,
          componentStack: log.componentStack,
        }),
      );
    } catch (error) {
      reportLogBoxError(error);
    }
  });
}

export function addException(error) {
  // Parsing logs are expensive so we schedule this
  // otherwise spammy logs would pause rendering.
  setImmediate(() => {
    try {
      appendNewLog(new LogBoxLog(parseLogBoxException(error)));
    } catch (loggingError) {
      reportLogBoxError(loggingError);
    }
  });
}

export function symbolicateLogNow(log) {
  log.symbolicate(() => {
    handleUpdate();
  });
}

export function retrySymbolicateLogNow(log) {
  log.retrySymbolicate(() => {
    handleUpdate();
  });
}

export function symbolicateLogLazy(log) {
  log.symbolicate();
}

export function clear() {
  if (logs.size > 0) {
    logs = new Set();
    setSelectedLog(-1);
  }
}

export function setSelectedLog(proposedNewIndex) {
  const oldIndex = _selectedIndex;
  let newIndex = proposedNewIndex;

  const logArray = Array.from(logs);
  let index = logArray.length - 1;
  while (index >= 0) {
    // The latest syntax error is selected and displayed before all other logs.
    if (logArray[index].level === 'syntax') {
      newIndex = index;
      break;
    }
    index -= 1;
  }
  _selectedIndex = newIndex;
  handleUpdate();
  if (NativeLogBox) {
    setTimeout(() => {
      if (oldIndex < 0 && newIndex >= 0) {
        NativeLogBox.show();
      } else if (oldIndex >= 0 && newIndex < 0) {
        NativeLogBox.hide();
      }
    }, 0);
  }
}

export function clearWarnings() {
  const newLogs = Array.from(logs).filter(log => log.level !== 'warn');
  if (newLogs.length !== logs.size) {
    logs = new Set(newLogs);
    setSelectedLog(-1);
    handleUpdate();
  }
}

export function clearErrors() {
  const newLogs = Array.from(logs).filter(
    log => log.level !== 'error' && log.level !== 'fatal',
  );
  if (newLogs.length !== logs.size) {
    logs = new Set(newLogs);
    setSelectedLog(-1);
  }
}

export function dismiss(log) {
  if (logs.has(log)) {
    logs.delete(log);
    handleUpdate();
  }
}

export function setWarningFilter(filter) {
  warningFilter = filter;
}

export function setAppInfo(info) {
  appInfo = info;
}

export function getAppInfo() {
  return appInfo != null ? appInfo() : null;
}

export function checkWarningFilter(format) {
  return warningFilter(format);
}

export function getIgnorePatterns() {
  return Array.from(ignorePatterns);
}

export function addIgnorePatterns(
  patterns,
) {
  const existingSize = ignorePatterns.size;
  // The same pattern may be added multiple times, but adding a new pattern
  // can be expensive so let's find only the ones that are new.
  patterns.forEach((pattern) => {
    if (pattern instanceof RegExp) {
      for (const existingPattern of ignorePatterns) {
        if (
          existingPattern instanceof RegExp &&
          existingPattern.toString() === pattern.toString()
        ) {
          return;
        }
      }
      ignorePatterns.add(pattern);
    }
    ignorePatterns.add(pattern);
  });
  if (ignorePatterns.size === existingSize) {
    return;
  }
  // We need to recheck all of the existing logs.
  // This allows adding an ignore pattern anywhere in the codebase.
  // Without this, if you ignore a pattern after the a log is created,
  // then we would keep showing the log.
  logs = new Set(
    Array.from(logs).filter(log => !isMessageIgnored(log.message.content)),
  );
  handleUpdate();
}

export function setDisabled(value) {
  if (value === _isDisabled) {
    return;
  }
  _isDisabled = value;
  handleUpdate();
}

export function isDisabled() {
  return _isDisabled;
}

export function observe(observer) {
  const subscription = {observer};
  observers.add(subscription);

  observer(getNextState());

  return {
    unsubscribe() {
      observers.delete(subscription);
    },
  };
}



export function withSubscription(
  WrappedComponent,
) {
  class LogBoxStateSubscription extends React.Component {
    static getDerivedStateFromError() {
      return {hasError: true};
    }

    componentDidCatch(err, errorInfo) {
      /* $FlowFixMe[class-object-subtyping] added when improving typing for
       * this parameters */
      reportLogBoxError(err, errorInfo.componentStack);
    }

    _subscription;

    state = {
      logs: new Set(),
      isDisabled: false,
      hasError: false,
      selectedLogIndex: -1,
    };

    render() {
      if (this.state.hasError) {
        // This happens when the component failed to render, in which case we delegate to the native redbox.
        // We can't show anyback fallback UI here, because the error may be with <View> or <Text>.
        return null;
      }

      return (
        <WrappedComponent
          logs={Array.from(this.state.logs)}
          isDisabled={this.state.isDisabled}
          selectedLogIndex={this.state.selectedLogIndex}
        />
      );
    }

    componentDidMount() {
      this._subscription = observe(data => {
        this.setState(data);
      });
    }

    componentWillUnmount() {
      if (this._subscription != null) {
        this._subscription.unsubscribe();
      }
    }

    _handleDismiss = () => {
      // Here we handle the cases when the log is dismissed and it
      // was either the last log, or when the current index
      // is now outside the bounds of the log array.
      const {selectedLogIndex, logs: stateLogs} = this.state;
      const logsArray = Array.from(stateLogs);
      if (selectedLogIndex != null) {
        if (logsArray.length - 1 <= 0) {
          setSelectedLog(-1);
        } else if (selectedLogIndex >= logsArray.length - 1) {
          setSelectedLog(selectedLogIndex - 1);
        }

        dismiss(logsArray[selectedLogIndex]);
      }
    };

    _handleMinimize = () => {
      setSelectedLog(-1);
    };

    _handleSetSelectedLog = (index) => {
      setSelectedLog(index);
    };
  }

  return LogBoxStateSubscription;
}
