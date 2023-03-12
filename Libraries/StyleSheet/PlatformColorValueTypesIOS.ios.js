/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 *  strict-local
 */


import {DynamicColorIOSPrivate} from './PlatformColorValueTypes';


export const DynamicColorIOS = (tuple) => {
  return DynamicColorIOSPrivate({
    light: tuple.light,
    dark: tuple.dark,
    highContrastLight: tuple.highContrastLight,
    highContrastDark: tuple.highContrastDark,
  });
};
