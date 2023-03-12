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


const Context =
  React.createContext(null);

if (__DEV__) {
  Context.displayName = 'ImageAnalyticsTagContext';
}

export default Context;
