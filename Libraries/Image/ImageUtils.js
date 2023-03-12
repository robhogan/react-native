/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */


export function convertObjectFitToResizeMode(objectFit) {
  const objectFitMap = {
    contain: 'contain',
    cover: 'cover',
    fill: 'stretch',
    'scale-down': 'contain',
  };
  return objectFitMap[objectFit];
}
