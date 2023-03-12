/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *  strict-local
 * @format
 */

'use strict';

/**
 * Perform a set of runtime diagnostics, usually useful for test purpose.
 * This is only meaningful for __DEV__ mode.
 */


const flags = [];
let isEnabled = false;
let shouldEnableAll = false;

if (__DEV__) {
  if (typeof global.RN$DiagnosticFlags === 'string') {
    global.RN$DiagnosticFlags.split(',').forEach(flag => {
      switch (flag) {
        case 'early_js_errors':
        case 'all':
          flags.push(flag);
          break;
        default:
          throw Error(
            `RuntimeDiagnosticsFlags: unknown flag was supplied: '${flag}'`,
          );
      }
    });
    isEnabled = flags.length > 0;
    shouldEnableAll = flags.includes('all');
  }
}

const ReactNativeRuntimeDiagnostics = {
  isEnabled: () => isEnabled,
  simulateEarlyJavaScriptErrors: () => {
    if (__DEV__) {
      if (!isEnabled) {
        return;
      }
      if (shouldEnableAll || flags.includes('early_js_errors')) {
        throw Error('[Runtime Diagnostics] Throwing a JavaScript error.');
      }
    }
  },
};

module.exports = ReactNativeRuntimeDiagnostics;
