/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 *  strict-local
 */


import BaseViewConfig from './BaseViewConfig';


const PlatformBaseViewConfig = BaseViewConfig;

// In Wilde/FB4A, use RNHostComponentListRoute in Bridge mode to verify
// whether the JS props defined here match the native props defined
// in RCTViewManagers in iOS, and ViewManagers in Android.
export default PlatformBaseViewConfig;
