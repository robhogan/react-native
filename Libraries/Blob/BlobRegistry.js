/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *  strict
 * @format
 */

const registry = {};

const register = (id) => {
  if (registry[id]) {
    registry[id]++;
  } else {
    registry[id] = 1;
  }
};

const unregister = (id) => {
  if (registry[id]) {
    registry[id]--;
    if (registry[id] <= 0) {
      delete registry[id];
    }
  }
};

const has = (id) => {
  return registry[id] && registry[id] > 0;
};

module.exports = {
  register,
  unregister,
  has,
};
