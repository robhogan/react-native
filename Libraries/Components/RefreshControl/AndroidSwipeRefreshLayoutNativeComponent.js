/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 *  strict-local
 */

import * as React from 'react';

import codegenNativeCommands from 'react-native/Libraries/Utilities/codegenNativeCommands';
import codegenNativeComponent from '../../Utilities/codegenNativeComponent';





export const Commands = codegenNativeCommands({
  supportedCommands: ['setNativeRefreshing'],
});

export default (codegenNativeComponent(
  'AndroidSwipeRefreshLayout',
));
