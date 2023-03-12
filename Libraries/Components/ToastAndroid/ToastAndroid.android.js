/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 *  strict-local
 */

import NativeToastAndroid from './NativeToastAndroid';

/**
 * This exposes the native ToastAndroid module as a JS module. This has a function 'show'
 * which takes the following parameters:
 *
 * 1. String message: A string with the text to toast
 * 2. int duration: The duration of the toast. May be ToastAndroid.SHORT or ToastAndroid.LONG
 *
 * There is also a function `showWithGravity` to specify the layout gravity. May be
 * ToastAndroid.TOP, ToastAndroid.BOTTOM, ToastAndroid.CENTER.
 *
 * The 'showWithGravityAndOffset' function adds on the ability to specify offset
 * These offset values will translate to pixels.
 *
 * Basic usage:
 * ```javascript
 * ToastAndroid.show('A pikachu appeared nearby !', ToastAndroid.SHORT);
 * ToastAndroid.showWithGravity('All Your Base Are Belong To Us', ToastAndroid.SHORT, ToastAndroid.CENTER);
 * ToastAndroid.showWithGravityAndOffset('A wild toast appeared!', ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
 * ```
 */

const ToastAndroidConstants = NativeToastAndroid.getConstants();

const ToastAndroid = {
  // Toast duration constants
  SHORT: (ToastAndroidConstants.SHORT),
  LONG: (ToastAndroidConstants.LONG),
  // Toast gravity constants
  TOP: (ToastAndroidConstants.TOP),
  BOTTOM: (ToastAndroidConstants.BOTTOM),
  CENTER: (ToastAndroidConstants.CENTER),

  show: function (message, duration) {
    NativeToastAndroid.show(message, duration);
  },

  showWithGravity: function (
    message,
    duration,
    gravity,
  ) {
    NativeToastAndroid.showWithGravity(message, duration, gravity);
  },

  showWithGravityAndOffset: function (
    message,
    duration,
    gravity,
    xOffset,
    yOffset,
  ) {
    NativeToastAndroid.showWithGravityAndOffset(
      message,
      duration,
      gravity,
      xOffset,
      yOffset,
    );
  },
};

module.exports = ToastAndroid;
