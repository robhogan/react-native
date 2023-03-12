/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 *  strict
 */

import NativePlatformConstantsAndroid from './NativePlatformConstantsAndroid';


const Platform = {
  __constants: null,
  OS: 'android',
  // $FlowFixMe[unsafe-getters-setters]
  get Version() {
    return this.constants.Version;
  },
  // $FlowFixMe[unsafe-getters-setters]
  get constants() {
    if (this.__constants == null) {
      this.__constants = NativePlatformConstantsAndroid.getConstants();
    }
    return this.__constants;
  },
  // $FlowFixMe[unsafe-getters-setters]
  get isTesting() {
    if (__DEV__) {
      return this.constants.isTesting;
    }
    return false;
  },
  // $FlowFixMe[unsafe-getters-setters]
  get isTV() {
    return this.constants.uiMode === 'tv';
  },
  select:(spec) =>
    'android' in spec
      ? // $FlowFixMe[incompatible-return]
        spec.android
      : 'native' in spec
      ? // $FlowFixMe[incompatible-return]
        spec.native
      : // $FlowFixMe[incompatible-return]
        spec.default,
};

module.exports = Platform;
