/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *  strict
 * @format
 */

import * as React from 'react';

// TODO: Make this into an opaque type.

export const RootTagContext =
  React.createContext(0);

if (__DEV__) {
  RootTagContext.displayName = 'RootTagContext';
}

/**
 * Intended to only be used by `AppContainer`.
 */
export function createRootTag(rootTag) {
  return rootTag;
}
