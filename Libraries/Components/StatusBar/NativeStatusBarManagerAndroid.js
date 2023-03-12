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

  setColor(color, animated) {
    NativeModule.setColor(color, animated);
  },

  setTranslucent(translucent) {
    NativeModule.setTranslucent(translucent);
  },

  /**
   *  - statusBarStyles can be:
   *    - 'default'
   *    - 'dark-content'
   */
  setStyle(statusBarStyle) {
    NativeModule.setStyle(statusBarStyle);
  },

  setHidden(hidden) {
    NativeModule.setHidden(hidden);
  },
};

export default NativeStatusBarManager;
