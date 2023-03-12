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


function processFontVariant(
  fontVariant,
) {
  if (Array.isArray(fontVariant)) {
    return fontVariant;
  }

  // $FlowFixMe[incompatible-type]
  const match = fontVariant
    .split(' ')
    .filter(Boolean);

  return match;
}

module.exports = processFontVariant;
