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

/**
 * Faster version of `mergeInto` that doesn't check its arguments and
 * also copies over prototype inherited properties.
 *
 * @param {object} one Object to assign to.
 * @param {object} two Object to assign from.
 */
const mergeIntoFast = function (one, two) {
  for (const keyTwo in two) {
    one[keyTwo] = two[keyTwo];
  }
};

module.exports = mergeIntoFast;
