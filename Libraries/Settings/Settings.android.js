/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 */

'use strict';

const Settings = {
  get(key) {
    console.warn('Settings is not yet supported on Android');
    return null;
  },

  set(settings) {
    console.warn('Settings is not yet supported on Android');
  },

  watchKeys(keys, callback) {
    console.warn('Settings is not yet supported on Android');
    return -1;
  },

  clearWatch(watchId) {
    console.warn('Settings is not yet supported on Android');
  },
};

module.exports = Settings;
