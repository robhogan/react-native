/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 */

import RCTDeviceEventEmitter from '../EventEmitter/RCTDeviceEventEmitter';
import NativeSettingsManager from './NativeSettingsManager';
import invariant from 'invariant';

const subscriptions = [];

const Settings = {
  _settings: (NativeSettingsManager &&
    NativeSettingsManager.getConstants().settings),

  get(key) {
    // $FlowFixMe[object-this-reference]
    return this._settings[key];
  },

  set(settings) {
    // $FlowFixMe[object-this-reference]
    this._settings = Object.assign(this._settings, settings);
    NativeSettingsManager.setValues(settings);
  },

  watchKeys(keys, callback) {
    if (typeof keys === 'string') {
      keys = [keys];
    }

    invariant(
      Array.isArray(keys),
      'keys should be a string or array of strings',
    );

    const sid = subscriptions.length;
    subscriptions.push({keys: keys, callback: callback});
    return sid;
  },

  clearWatch(watchId) {
    if (watchId < subscriptions.length) {
      subscriptions[watchId] = {keys: [], callback: null};
    }
  },

  _sendObservations(body) {
    Object.keys(body).forEach(key => {
      const newValue = body[key];
      // $FlowFixMe[object-this-reference]
      const didChange = this._settings[key] !== newValue;
      // $FlowFixMe[object-this-reference]
      this._settings[key] = newValue;

      if (didChange) {
        subscriptions.forEach(sub => {
          if (sub.keys.indexOf(key) !== -1 && sub.callback) {
            sub.callback();
          }
        });
      }
    });
  },
};

RCTDeviceEventEmitter.addListener(
  'settingsUpdated',
  Settings._sendObservations.bind(Settings),
);

module.exports = Settings;
