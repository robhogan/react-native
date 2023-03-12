/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */

'use strict';


import flattenStyle from '../../StyleSheet/flattenStyle';
import NativeAnimatedHelper from '../NativeAnimatedHelper';
import AnimatedNode from './AnimatedNode';
import AnimatedTransform from './AnimatedTransform';
import AnimatedWithChildren from './AnimatedWithChildren';

export default class AnimatedStyle extends AnimatedWithChildren {
  _style;

  constructor(style) {
    super();
    style = flattenStyle(style) || ({});
    if (style.transform) {
      style = {
        ...style,
        transform: new AnimatedTransform(style.transform),
      };
    }
    this._style = style;
  }

  // Recursively get values for nested styles (like iOS's shadowOffset)
  _walkStyleAndGetValues(style) {
    const updatedStyle = {};
    for (const key in style) {
      const value = style[key];
      if (value instanceof AnimatedNode) {
        updatedStyle[key] = value.__getValue();
      } else if (value && !Array.isArray(value) && typeof value === 'object') {
        // Support animating nested values (for example: shadowOffset.height)
        updatedStyle[key] = this._walkStyleAndGetValues(value);
      } else {
        updatedStyle[key] = value;
      }
    }
    return updatedStyle;
  }

  __getValue() {
    return this._walkStyleAndGetValues(this._style);
  }

  // Recursively get animated values for nested styles (like iOS's shadowOffset)
  _walkStyleAndGetAnimatedValues(style) {
    const updatedStyle = {};
    for (const key in style) {
      const value = style[key];
      if (value instanceof AnimatedNode) {
        updatedStyle[key] = value.__getAnimatedValue();
      } else if (value && !Array.isArray(value) && typeof value === 'object') {
        // Support animating nested values (for example: shadowOffset.height)
        updatedStyle[key] = this._walkStyleAndGetAnimatedValues(value);
      }
    }
    return updatedStyle;
  }

  __getAnimatedValue() {
    return this._walkStyleAndGetAnimatedValues(this._style);
  }

  __attach() {
    for (const key in this._style) {
      const value = this._style[key];
      if (value instanceof AnimatedNode) {
        value.__addChild(this);
      }
    }
  }

  __detach() {
    for (const key in this._style) {
      const value = this._style[key];
      if (value instanceof AnimatedNode) {
        value.__removeChild(this);
      }
    }
    super.__detach();
  }

  __makeNative(platformConfig) {
    for (const key in this._style) {
      const value = this._style[key];
      if (value instanceof AnimatedNode) {
        value.__makeNative(platformConfig);
      }
    }
    super.__makeNative(platformConfig);
  }

  __getNativeConfig() {
    const styleConfig = {};
    for (const styleKey in this._style) {
      if (this._style[styleKey] instanceof AnimatedNode) {
        const style = this._style[styleKey];
        style.__makeNative(this.__getPlatformConfig());
        styleConfig[styleKey] = style.__getNativeTag();
      }
      // Non-animated styles are set using `setNativeProps`, no need
      // to pass those as a part of the node config
    }
    NativeAnimatedHelper.validateStyles(styleConfig);
    return {
      type: 'style',
      style: styleConfig,
    };
  }
}
