/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *  strict-local
 * @format
 */

import normalizeColor from '../StyleSheet/normalizeColor';
import {normalizeRect,} from '../StyleSheet/Rect';

import View from '../Components/View/View';
import * as React from 'react';


/**
 * Displays a debug overlay to visualize press targets when enabled via the
 * React Native Inspector. Calls to this module should be guarded by `__DEV__`,
 * for example:
 *
 *   return (
 *     <View>
 *       {children}
 *       {__DEV__ ? (
 *         <PressabilityDebugView color="..." hitSlop={props.hitSlop} />
 *       ) : null}
 *     </View>
 *   );
 *
 */
export function PressabilityDebugView(props) {
  if (__DEV__) {
    if (isEnabled()) {
      const normalizedColor = normalizeColor(props.color);
      if (typeof normalizedColor !== 'number') {
        return null;
      }
      const baseColor =
        '#' + (normalizedColor ?? 0).toString(16).padStart(8, '0');
      const hitSlop = normalizeRect(props.hitSlop);
      return (
        <View
          pointerEvents="none"
          style={
            // eslint-disable-next-line react-native/no-inline-styles
            {
              backgroundColor: baseColor.slice(0, -2) + '0F', // 15%
              borderColor: baseColor.slice(0, -2) + '55', // 85%
              borderStyle: 'dashed',
              borderWidth: 1,
              bottom: -(hitSlop?.bottom ?? 0),
              left: -(hitSlop?.left ?? 0),
              position: 'absolute',
              right: -(hitSlop?.right ?? 0),
              top: -(hitSlop?.top ?? 0),
            }
          }
        />
      );
    }
  }
  return null;
}

let isDebugEnabled = false;

export function isEnabled() {
  if (__DEV__) {
    return isDebugEnabled;
  }
  return false;
}

export function setEnabled(value) {
  if (__DEV__) {
    isDebugEnabled = value;
  }
}
