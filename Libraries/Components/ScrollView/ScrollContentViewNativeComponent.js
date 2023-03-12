/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 */

import * as NativeComponentRegistry from '../../NativeComponent/NativeComponentRegistry';

export const __INTERNAL_VIEW_CONFIG = {
  uiViewClassName: 'RCTScrollContentView',
  bubblingEventTypes: {},
  directEventTypes: {},
  validAttributes: {},
};

const ScrollContentViewNativeComponent =
  NativeComponentRegistry.get(
    'RCTScrollContentView',
    () => __INTERNAL_VIEW_CONFIG,
  );

export default ScrollContentViewNativeComponent;
