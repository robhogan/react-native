/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 *  strict-local
 */



export const PlatformColor = (...names) => {
  return {resource_paths: names};
};

export const normalizeColorObject = (
  color,
) => {
  if ('resource_paths' in color) {
    return color;
  }
  return null;
};

export const processColorObject = (
  color,
) => {
  return color;
};
