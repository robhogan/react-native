/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *  strict-local
 * @format
 */


import * as NativeComponentRegistry from '../../NativeComponent/NativeComponentRegistry';
import codegenNativeCommands from '../../Utilities/codegenNativeCommands';
import RCTTextInputViewConfig from './RCTTextInputViewConfig';



export const Commands = codegenNativeCommands({
  supportedCommands: ['focus', 'blur', 'setTextAndSelection'],
});

export const __INTERNAL_VIEW_CONFIG = {
  uiViewClassName: 'RCTMultilineTextInputView',
  ...RCTTextInputViewConfig,
  validAttributes: {
    ...RCTTextInputViewConfig.validAttributes,
    dataDetectorTypes: true,
  },
};

const MultilineTextInputNativeComponent =
  NativeComponentRegistry.get(
    'RCTMultilineTextInputView',
    () => __INTERNAL_VIEW_CONFIG,
  );

// flowlint-next-line unclear-type:off
export default ((MultilineTextInputNativeComponent));
