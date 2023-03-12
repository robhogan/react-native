/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *  strict-local
 * @format
 */


import codegenNativeCommands from '../../Utilities/codegenNativeCommands';
import codegenNativeComponent from '../../Utilities/codegenNativeComponent';
import * as React from 'react';





export const Commands = codegenNativeCommands({
  supportedCommands: ['setNativeValue'],
});

export default (codegenNativeComponent('AndroidSwitch', {
  interfaceOnly: true,
}));
