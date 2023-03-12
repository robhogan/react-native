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

import Image from './Image';
import * as React from 'react';
import StyleSheet from '../StyleSheet/StyleSheet';
import flattenStyle from '../StyleSheet/flattenStyle';
import View from '../Components/View/View';

/**
 * Very simple drop-in replacement for <Image> which supports nesting views.
 *
 * ```ReactNativeWebPlayer
 * import React, { Component } from 'react';
 * import { AppRegistry, View, ImageBackground, Text } from 'react-native';
 *
 * class DisplayAnImageBackground extends Component {
 *   render() {
 *     return (
 *       <ImageBackground
 *         style={{width: 50, height: 50}}
 *         source={{uri: 'https://reactnative.dev/img/opengraph.png'}}
 *       >
 *         <Text>React</Text>
 *       </ImageBackground>
 *     );
 *   }
 * }
 *
 * // App registration and rendering
 * AppRegistry.registerComponent('DisplayAnImageBackground', () => DisplayAnImageBackground);
 * ```
 */
class ImageBackground extends React.Component {
  setNativeProps(props) {
    // Work-around flow
    const viewRef = this._viewRef;
    if (viewRef) {
      viewRef.setNativeProps(props);
    }
  }

  _viewRef = null;

  _captureRef = (
    ref,
  ) => {
    this._viewRef = ref;
  };

  render() {
    const {children, style, imageStyle, imageRef, ...props} = this.props;
    const flattenedStyle = flattenStyle(style);
    return (
      <View
        accessibilityIgnoresInvertColors={true}
        style={style}
        ref={this._captureRef}>
        <Image
          {...props}
          style={[
            StyleSheet.absoluteFill,
            {
              // Temporary Workaround:
              // Current (imperfect yet) implementation of <Image> overwrites width and height styles
              // (which is not quite correct), and these styles conflict with explicitly set styles
              // of <ImageBackground> and with our internal layout model here.
              // So, we have to proxy/reapply these styles explicitly for actual <Image> component.
              // This workaround should be removed after implementing proper support of
              // intrinsic content size of the <Image>.
              width: flattenedStyle?.width,
              height: flattenedStyle?.height,
            },
            imageStyle,
          ]}
          ref={imageRef}
        />
        {children}
      </View>
    );
  }
}

module.exports = ImageBackground;
