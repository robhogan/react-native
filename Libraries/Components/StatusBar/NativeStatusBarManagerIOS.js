/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *  strict
 * @format
 */


import * as TurboModuleRegistry from '../../TurboModule/TurboModuleRegistry';


const NativeModule = TurboModuleRegistry.getEnforcing('StatusBarManager');
let constants = null;

const NativeStatusBarManager = {
  getConstants() {
    if (constants == null) {
      constants = NativeModule.getConstants();
    }
    return constants;
  },

  // TODO(T47754272) Can we remove this method?
  getHeight(callback) {
    NativeModule.getHeight(callback);
  },

  setNetworkActivityIndicatorVisible(visible) {
    NativeModule.setNetworkActivityIndicatorVisible(visible);
  },

  addListener(eventType) {
    NativeModule.addListener(eventType);
  },

  removeListeners(count) {
    NativeModule.removeListeners(count);
  },

  /**
   *  - statusBarStyles can be:
   *    - 'default'
   *    - 'dark-content'
   *    - 'light-content'
   */
  setStyle(statusBarStyle, animated) {
    NativeModule.setStyle(statusBarStyle, animated);
  },

  /**
   *  - withAnimation can be: 'none' | 'fade' | 'slide'
   */
  setHidden(hidden, withAnimation) {
    NativeModule.setHidden(hidden, withAnimation);
  },
};

export default NativeStatusBarManager;
