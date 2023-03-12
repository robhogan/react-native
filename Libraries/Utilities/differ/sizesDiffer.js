/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *  strict
 * @format
 */

'use strict';

const dummySize = {width: undefined, height: undefined};

const sizesDiffer = function (one, two) {
  const defaultedOne = one || dummySize;
  const defaultedTwo = two || dummySize;
  return (
    defaultedOne !== defaultedTwo &&
    (defaultedOne.width !== defaultedTwo.width ||
      defaultedOne.height !== defaultedTwo.height)
  );
};

module.exports = sizesDiffer;
