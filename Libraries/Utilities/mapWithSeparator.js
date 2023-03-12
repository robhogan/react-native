/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 *  strict
 */

'use strict';

function mapWithSeparator(
  items,
  itemRenderer,
  spacerRenderer,
) {
  const mapped = [];
  if (items.length > 0) {
    mapped.push(itemRenderer(items[0], 0, items));
    for (let ii = 1; ii < items.length; ii++) {
      mapped.push(spacerRenderer(ii - 1), itemRenderer(items[ii], ii, items));
    }
  }
  return mapped;
}

module.exports = mapWithSeparator;
