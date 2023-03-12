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


const dummyInsets = {
  top: undefined,
  left: undefined,
  right: undefined,
  bottom: undefined,
};

const insetsDiffer = function (one, two) {
  one = one || dummyInsets;
  two = two || dummyInsets;
  return (
    one !== two &&
    (one.top !== two.top ||
      one.left !== two.left ||
      one.right !== two.right ||
      one.bottom !== two.bottom)
  );
};

module.exports = insetsDiffer;
