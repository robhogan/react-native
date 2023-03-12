/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 *  strict
 */

import NativePlatformConstantsIOS from './NativePlatformConstantsIOS';


const Platform = {
  __constants: null,
  OS: 'ios',
  // $FlowFixMe[unsafe-getters-setters]
  get Version() {
    // $FlowFixMe[object-this-reference]
    return this.constants.osVersion;
  },
  // $FlowFixMe[unsafe-getters-setters]
  get constants() {
    // $FlowFixMe[object-this-reference]
    if (this.__constants == null) {
      // $FlowFixMe[object-this-reference]
      this.__constants = NativePlatformConstantsIOS.getConstants();
    }
    // $FlowFixMe[object-this-reference]
    return this.__constants;
  },
  // $FlowFixMe[unsafe-getters-setters]
  get isPad() {
    // $FlowFixMe[object-this-reference]
    return this.constants.interfaceIdiom === 'pad';
  },
  // $FlowFixMe[unsafe-getters-setters]
  get isTV() {
    // $FlowFixMe[object-this-reference]
    return this.constants.interfaceIdiom === 'tv';
  },
  // $FlowFixMe[unsafe-getters-setters]
  get isTesting() {
    if (__DEV__) {
      // $FlowFixMe[object-this-reference]
      return this.constants.isTesting;
    }
    return false;
  },
  select:(spec) =>
    // $FlowFixMe[incompatible-return]
    'ios' in spec ? spec.ios : 'native' in spec ? spec.native : spec.default,
};

module.exports = Platform;
