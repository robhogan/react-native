/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 *  strict-local
 */

'use strict';


// This shim ensures DEV binary builds don't crash in JS
// when they're combined with a PROD JavaScript build.
const HMRClientProdShim = {
  setup() {},
  enable() {
    console.error(
      'Fast Refresh is disabled in JavaScript bundles built in production mode. ' +
        'Did you forget to run Metro?',
    );
  },
  disable() {},
  registerBundle() {},
  log() {},
};

module.exports = HMRClientProdShim;
