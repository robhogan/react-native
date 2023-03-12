/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 *  strict
 */



export function createSquare(size) {
  return {bottom: size, left: size, right: size, top: size};
}

export function normalizeRect(rectOrSize) {
  return typeof rectOrSize === 'number' ? createSquare(rectOrSize) : rectOrSize;
}
