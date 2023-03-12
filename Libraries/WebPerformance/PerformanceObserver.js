/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 *  strict
 */


import warnOnce from '../Utilities/warnOnce';
import NativePerformanceObserver from './NativePerformanceObserver';

// TODO: Extend once new types (such as event) are supported.
// TODO: Get rid of the "undefined" once there is at least one type supported.

export class PerformanceEntry {
  name;
  entryType;
  startTime;
  duration;

  constructor(init) {
    this.name = init.name;
    this.entryType = init.entryType;
    this.startTime = init.startTime;
    this.duration = init.duration;
  }

  // $FlowIgnore: Flow(unclear-type)
  toJSON() {
    return {
      name: this.name,
      entryType: this.entryType,
      startTime: this.startTime,
      duration: this.duration,
    };
  }
}

function rawToPerformanceEntryType(
  type,
) {
  return 'undefined';
}

function rawToPerformanceEntry(entry) {
  return new PerformanceEntry({
    name: entry.name,
    entryType: rawToPerformanceEntryType(entry.entryType),
    startTime: entry.startTime,
    duration: entry.duration,
  });
}


export class PerformanceObserverEntryList {
  _entries;

  constructor(entries) {
    this._entries = entries;
  }

  getEntries() {
    return this._entries;
  }

  getEntriesByType(type) {
    return this._entries.filter(entry => entry.entryType === type);
  }

  getEntriesByName(
    name,
    type,
  ) {
    if (type === undefined) {
      return this._entries.filter(entry => entry.name === name);
    } else {
      return this._entries.filter(
        entry => entry.name === name && entry.entryType === type,
      );
    }
  }
}



let _observedEntryTypeRefCount = new Map();

let _observers = new Set();

let _onPerformanceEntryCallbackIsSet = false;

function warnNoNativePerformanceObserver() {
  warnOnce(
    'missing-native-performance-observer',
    'Missing native implementation of PerformanceObserver',
  );
}

/**
 * Implementation of the PerformanceObserver interface for RN,
 * corresponding to the standard in https://www.w3.org/TR/performance-timeline/
 *
 * @example
 * const observer = new PerformanceObserver((list, _observer) => {
 *   const entries = list.getEntries();
 *   entries.forEach(entry => {
 *     reportEvent({
 *       eventName: entry.name,
 *       startTime: entry.startTime,
 *       endTime: entry.startTime + entry.duration,
 *       processingStart: entry.processingStart,
 *       processingEnd: entry.processingEnd,
 *       interactionId: entry.interactionId,
 *     });
 *   });
 * });
 * observer.observe({ type: "event" });
 */
export default class PerformanceObserver {
  _callback;
  _entryTypes;

  constructor(callback) {
    this._callback = callback;
  }

  observe(options) {
    if (!NativePerformanceObserver) {
      warnNoNativePerformanceObserver();
      return;
    }
    if (!_onPerformanceEntryCallbackIsSet) {
      NativePerformanceObserver.setOnPerformanceEntryCallback(
        onPerformanceEntry,
      );
      _onPerformanceEntryCallbackIsSet = true;
    }
    if (options.entryTypes) {
      this._entryTypes = new Set(options.entryTypes);
    } else {
      this._entryTypes = new Set([options.type]);
    }
    this._entryTypes.forEach(type => {
      if (!_observedEntryTypeRefCount.has(type)) {
        NativePerformanceObserver.startReporting(type);
      }
      _observedEntryTypeRefCount.set(
        type,
        (_observedEntryTypeRefCount.get(type) ?? 0) + 1,
      );
    });
    _observers.add(this);
  }

  disconnect() {
    if (!NativePerformanceObserver) {
      warnNoNativePerformanceObserver();
      return;
    }
    this._entryTypes.forEach(type => {
      const entryTypeRefCount = _observedEntryTypeRefCount.get(type) ?? 0;
      if (entryTypeRefCount === 1) {
        _observedEntryTypeRefCount.delete(type);
        NativePerformanceObserver.stopReporting(type);
      } else if (entryTypeRefCount !== 0) {
        _observedEntryTypeRefCount.set(type, entryTypeRefCount - 1);
      }
    });
    _observers.delete(this);
    if (_observers.size === 0) {
      NativePerformanceObserver.setOnPerformanceEntryCallback(undefined);
      _onPerformanceEntryCallbackIsSet = false;
    }
  }

  static supportedEntryTypes =
    // TODO: add types once they are fully supported
    Object.freeze([]);
}

// This is a callback that gets scheduled and periodically called from the native side
function onPerformanceEntry() {
  if (!NativePerformanceObserver) {
    return;
  }
  const rawEntries = NativePerformanceObserver.getPendingEntries();
  const entries = rawEntries.map(rawToPerformanceEntry);
  _observers.forEach(observer => {
    const entriesForObserver = entries.filter(entry =>
      observer._entryTypes.has(entry.entryType),
    );
    observer._callback(
      new PerformanceObserverEntryList(entriesForObserver),
      observer,
    );
  });
}
