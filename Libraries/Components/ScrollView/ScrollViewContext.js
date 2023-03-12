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


const ScrollViewContext = React.createContext(null);
if (__DEV__) {
  ScrollViewContext.displayName = 'ScrollViewContext';
}
export default ScrollViewContext;

export const HORIZONTAL = Object.freeze({horizontal: true});
export const VERTICAL = Object.freeze({horizontal: false});
