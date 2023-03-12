/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *  strict-local
 * @format
 */

import {} from './PressabilityTypes.js';


class PressabilityPerformanceEventEmitter {
  _listeners = [];

  constructor() {}

  addListener(listener) {
    this._listeners.push(listener);
  }

  removeListener(listener) {
    const index = this._listeners.indexOf(listener);
    if (index > -1) {
      this._listeners.splice(index, 1);
    }
  }

  emitEvent(constructEvent) {
    if (this._listeners.length === 0) {
      return;
    }

    const event = constructEvent();
    this._listeners.forEach(listener => listener(event));
  }
}

const PressabilityPerformanceEventEmitterSingleton =
  new PressabilityPerformanceEventEmitter();

export default PressabilityPerformanceEventEmitterSingleton;
