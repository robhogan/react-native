/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *  strict-local
 * @format
 */

'use strict';

const StyleSheet = require('../StyleSheet');

const imageStyle = {tintColor: 'rgb(0, 0, 0)'};
const textStyle = {color: 'rgb(0, 0, 0)'};

module.exports = {
  testGoodCompose() {
    (StyleSheet.compose(imageStyle, imageStyle));

    (StyleSheet.compose(textStyle, textStyle));

    (StyleSheet.compose(null, null));

    (StyleSheet.compose(textStyle, null));

    (StyleSheet.compose(
      textStyle,
      Math.random() < 0.5 ? textStyle : null,
    ));

    (StyleSheet.compose([textStyle], null));

    (StyleSheet.compose([textStyle], null));

    (StyleSheet.compose([textStyle], [textStyle]));
  },

  testBadCompose() {
    // $FlowExpectedError - Incompatible type.
    (StyleSheet.compose(textStyle, textStyle));

    // $FlowExpectedError - Incompatible type.
    (StyleSheet.compose(
      // $FlowExpectedError - Incompatible type.
      [textStyle],
      null,
    ));

    // $FlowExpectedError - Incompatible type.
    (StyleSheet.compose(
      Math.random() < 0.5 ? textStyle : null,
      null,
    ));
  },
};
