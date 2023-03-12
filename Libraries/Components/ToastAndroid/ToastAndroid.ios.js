/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 */

'use strict';

const ToastAndroid = {
  show: function (message, duration) {
    console.warn('ToastAndroid is not supported on this platform.');
  },

  showWithGravity: function (
    message,
    duration,
    gravity,
  ) {
    console.warn('ToastAndroid is not supported on this platform.');
  },

  showWithGravityAndOffset: function (
    message,
    duration,
    gravity,
    xOffset,
    yOffset,
  ) {
    console.warn('ToastAndroid is not supported on this platform.');
  },
};

module.exports = ToastAndroid;
