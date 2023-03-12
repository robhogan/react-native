/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *  strict-local
 * @format
 */

import * as React from 'react';


// This can be undefined, null, or the experimental implementation. If this is
// null, that means `createAnimatedComponent` has already been initialized and
// it is too late to call `inject`.
let injected;

/**
 * Call during bundle initialization to opt-in to new `createAnimatedComponent`.
 */
export function inject(newInjected) {
  if (injected !== undefined) {
    if (__DEV__) {
      console.error(
        'createAnimatedComponentInjection: ' +
          (injected == null
            ? 'Must be called before `createAnimatedComponent`.'
            : 'Cannot be called more than once.'),
      );
    }
    return;
  }
  injected = newInjected;
}

/**
 * Only called by `createAnimatedComponent.js`.
 */
export function recordAndRetrieve() {
  if (injected === undefined) {
    injected = null;
  }
  return injected;
}
