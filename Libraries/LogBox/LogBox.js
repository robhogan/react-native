/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *  strict
 * @format
 */

import Platform from '../Utilities/Platform';
import RCTLog from '../Utilities/RCTLog';



let LogBox;


/**
 * LogBox displays logs in the app.
 */
if (__DEV__) {
  const LogBoxData = require('./Data/LogBoxData');
  const {parseLogBoxLog, parseInterpolation} = require('./Data/parseLogBoxLog');

  let originalConsoleError;
  let originalConsoleWarn;
  let consoleErrorImpl;
  let consoleWarnImpl;

  let isLogBoxInstalled = false;

  LogBox = {
    install() {
      if (isLogBoxInstalled) {
        return;
      }

      isLogBoxInstalled = true;

      // Trigger lazy initialization of module.
      require('../NativeModules/specs/NativeLogBox');

      // IMPORTANT: we only overwrite `console.error` and `console.warn` once.
      // When we uninstall we keep the same reference and only change its
      // internal implementation
      const isFirstInstall = originalConsoleError == null;
      if (isFirstInstall) {
        originalConsoleError = console.error.bind(console);
        originalConsoleWarn = console.warn.bind(console);

        // $FlowExpectedError[cannot-write]
        console.error = (...args) => {
          consoleErrorImpl(...args);
        };
        // $FlowExpectedError[cannot-write]
        console.warn = (...args) => {
          consoleWarnImpl(...args);
        };
      }

      consoleErrorImpl = registerError;
      consoleWarnImpl = registerWarning;

      if (Platform.isTesting) {
        LogBoxData.setDisabled(true);
      }

      RCTLog.setWarningHandler((...args) => {
        registerWarning(...args);
      });
    },

    uninstall() {
      if (!isLogBoxInstalled) {
        return;
      }

      isLogBoxInstalled = false;

      // IMPORTANT: we don't re-assign to `console` in case the method has been
      // decorated again after installing LogBox. E.g.:
      // Before uninstalling: original > LogBox > OtherErrorHandler
      // After uninstalling:  original > LogBox (noop) > OtherErrorHandler
      consoleErrorImpl = originalConsoleError;
      consoleWarnImpl = originalConsoleWarn;
    },

    isInstalled() {
      return isLogBoxInstalled;
    },

    ignoreLogs(patterns) {
      LogBoxData.addIgnorePatterns(patterns);
    },

    ignoreAllLogs(value) {
      LogBoxData.setDisabled(value == null ? true : value);
    },

    clearAllLogs() {
      LogBoxData.clear();
    },

    addLog(log) {
      if (isLogBoxInstalled) {
        LogBoxData.addLog(log);
      }
    },

    addException(error) {
      if (isLogBoxInstalled) {
        LogBoxData.addException(error);
      }
    },
  };

  const isRCTLogAdviceWarning = (...args) => {
    // RCTLogAdvice is a native logging function designed to show users
    // a message in the console, but not show it to them in Logbox.
    return typeof args[0] === 'string' && args[0].startsWith('(ADVICE)');
  };

  const isWarningModuleWarning = (...args) => {
    return typeof args[0] === 'string' && args[0].startsWith('Warning: ');
  };

  const registerWarning = (...args) => {
    // Let warnings within LogBox itself fall through.
    if (LogBoxData.isLogBoxErrorMessage(String(args[0]))) {
      originalConsoleError(...args);
      return;
    }

    try {
      if (!isRCTLogAdviceWarning(...args)) {
        const {category, message, componentStack} = parseLogBoxLog(args);

        if (!LogBoxData.isMessageIgnored(message.content)) {
          // Be sure to pass LogBox warnings through.
          originalConsoleWarn(...args);

          LogBoxData.addLog({
            level: 'warn',
            category,
            message,
            componentStack,
          });
        }
      }
    } catch (err) {
      LogBoxData.reportLogBoxError(err);
    }
  };

  /* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
   * LTI update could not be added via codemod */
  const registerError = (...args) => {
    // Let errors within LogBox itself fall through.
    if (LogBoxData.isLogBoxErrorMessage(args[0])) {
      originalConsoleError(...args);
      return;
    }

    try {
      if (!isWarningModuleWarning(...args)) {
        // Only show LogBox for the 'warning' module, otherwise pass through.
        // By passing through, this will get picked up by the React console override,
        // potentially adding the component stack. React then passes it back to the
        // React Native ExceptionsManager, which reports it to LogBox as an error.
        //
        // The 'warning' module needs to be handled here because React internally calls
        // `console.error('Warning: ')` with the component stack already included.
        originalConsoleError(...args);
        return;
      }

      const format = args[0].replace('Warning: ', '');
      const filterResult = LogBoxData.checkWarningFilter(format);
      if (filterResult.suppressCompletely) {
        return;
      }

      let level = 'error';
      if (filterResult.suppressDialog_LEGACY === true) {
        level = 'warn';
      } else if (filterResult.forceDialogImmediately === true) {
        level = 'fatal'; // Do not downgrade. These are real bugs with same severity as throws.
      }

      // Unfortunately, we need to add the Warning: prefix back for downstream dependencies.
      args[0] = `Warning: ${filterResult.finalFormat}`;
      const {category, message, componentStack} = parseLogBoxLog(args);

      if (!LogBoxData.isMessageIgnored(message.content)) {
        // Interpolate the message so they are formatted for adb and other CLIs.
        // This is different than the message.content above because it includes component stacks.
        const interpolated = parseInterpolation(args);
        originalConsoleError(interpolated.message.content);

        LogBoxData.addLog({
          level,
          category,
          message,
          componentStack,
        });
      }
    } catch (err) {
      LogBoxData.reportLogBoxError(err);
    }
  };
} else {
  LogBox = {
    install() {
      // Do nothing.
    },

    uninstall() {
      // Do nothing.
    },

    isInstalled() {
      return false;
    },

    ignoreLogs(patterns) {
      // Do nothing.
    },

    ignoreAllLogs(value) {
      // Do nothing.
    },

    clearAllLogs() {
      // Do nothing.
    },

    addLog(log) {
      // Do nothing.
    },

    addException(error) {
      // Do nothing.
    },
  };
}

module.exports = (LogBox);
