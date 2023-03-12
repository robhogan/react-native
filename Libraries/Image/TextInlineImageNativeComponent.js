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

import * as NativeComponentRegistry from '../NativeComponent/NativeComponentRegistry';


export const __INTERNAL_VIEW_CONFIG = {
  uiViewClassName: 'RCTTextInlineImage',
  bubblingEventTypes: {},
  directEventTypes: {},
  validAttributes: {
    resizeMode: true,
    src: true,
    tintColor: {
      process: require('../StyleSheet/processColor'),
    },
    headers: true,
  },
};

const TextInlineImage =
  NativeComponentRegistry.get(
    'RCTTextInlineImage',
    () => __INTERNAL_VIEW_CONFIG,
  );

export default TextInlineImage;
