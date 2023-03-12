/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *  strict
 * @format
 */


import * as TurboModuleRegistry from '../TurboModule/TurboModuleRegistry';





const NativeModule = TurboModuleRegistry.getEnforcing('DeviceInfo');
let constants = null;

const NativeDeviceInfo = {
  getConstants() {
    if (constants == null) {
      constants = NativeModule.getConstants();
    }
    return constants;
  },
};

export default NativeDeviceInfo;
