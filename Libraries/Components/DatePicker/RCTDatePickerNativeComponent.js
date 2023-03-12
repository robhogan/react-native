/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 *  strict-local
 */

import codegenNativeCommands from 'react-native/Libraries/Utilities/codegenNativeCommands';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import * as React from 'react';





export const Commands = codegenNativeCommands({
  supportedCommands: ['setNativeDate'],
});

export default (codegenNativeComponent('DatePicker', {
  paperComponentName: 'RCTDatePicker',
  excludedPlatforms: ['android'],
}));
