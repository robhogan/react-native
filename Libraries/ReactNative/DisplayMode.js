/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *  strict-local
 * @format
 */


/** DisplayMode should be in sync with the method displayModeToInt from
 * react/renderer/uimanager/primitives.h. */
const DisplayMode = Object.freeze({
  VISIBLE: 1,
  SUSPENDED: 2,
  HIDDEN: 3,
});

export function coerceDisplayMode(value) {
  switch (value) {
    case DisplayMode.SUSPENDED:
      return DisplayMode.SUSPENDED;
    case DisplayMode.HIDDEN:
      return DisplayMode.HIDDEN;
    default:
      return DisplayMode.VISIBLE;
  }
}

export default DisplayMode;
