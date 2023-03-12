/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */

import ReactNativeViewAttributes from '../Components/View/ReactNativeViewAttributes';
import UIManager from '../ReactNative/UIManager';
import {} from '../Renderer/shims/ReactNativeTypes';
import createReactNativeComponentClass from '../Renderer/shims/createReactNativeComponentClass';
import {} from '../StyleSheet/processColor';
import {} from './TextProps';
import {} from '../Types/CoreEventTypes';


export const NativeText =
  (createReactNativeComponentClass('RCTText', () => ({
    validAttributes: {
      ...ReactNativeViewAttributes.UIView,
      isHighlighted: true,
      isPressable: true,
      numberOfLines: true,
      ellipsizeMode: true,
      allowFontScaling: true,
      maxFontSizeMultiplier: true,
      disabled: true,
      selectable: true,
      selectionColor: true,
      adjustsFontSizeToFit: true,
      minimumFontScale: true,
      textBreakStrategy: true,
      onTextLayout: true,
      onInlineViewLayout: true,
      dataDetectorType: true,
      android_hyphenationFrequency: true,
    },
    directEventTypes: {
      topTextLayout: {
        registrationName: 'onTextLayout',
      },
      topInlineViewLayout: {
        registrationName: 'onInlineViewLayout',
      },
    },
    uiViewClassName: 'RCTText',
  })));

export const NativeVirtualText =
  !global.RN$Bridgeless && !UIManager.hasViewManagerConfig('RCTVirtualText')
    ? NativeText
    : (createReactNativeComponentClass('RCTVirtualText', () => ({
        validAttributes: {
          ...ReactNativeViewAttributes.UIView,
          isHighlighted: true,
          isPressable: true,
          maxFontSizeMultiplier: true,
        },
        uiViewClassName: 'RCTVirtualText',
      })));
