/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 *  strict-local
 */

import Platform from '../../Utilities/Platform';

function processDecelerationRate(
  decelerationRate,
) {
  if (decelerationRate === 'normal') {
    return Platform.select({
      ios: 0.998,
      android: 0.985,
    });
  } else if (decelerationRate === 'fast') {
    return Platform.select({
      ios: 0.99,
      android: 0.9,
    });
  }
  return decelerationRate;
}

module.exports = processDecelerationRate;
