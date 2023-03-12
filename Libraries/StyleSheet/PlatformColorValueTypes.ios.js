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
  return {semantic: names};
};


export const DynamicColorIOSPrivate = (
  tuple,
) => {
  return {
    dynamic: {
      light: tuple.light,
      dark: tuple.dark,
      highContrastLight: tuple.highContrastLight,
      highContrastDark: tuple.highContrastDark,
    },
  };
};

export const normalizeColorObject = (
  color,
) => {
  if ('semantic' in color) {
    // an ios semantic color
    return color;
  } else if ('dynamic' in color && color.dynamic !== undefined) {
    const normalizeColor = require('./normalizeColor');

    // a dynamic, appearance aware color
    const dynamic = color.dynamic;
    const dynamicColor = {
      dynamic: {
        // $FlowFixMe[incompatible-use]
        light: normalizeColor(dynamic.light),
        // $FlowFixMe[incompatible-use]
        dark: normalizeColor(dynamic.dark),
        // $FlowFixMe[incompatible-use]
        highContrastLight: normalizeColor(dynamic.highContrastLight),
        // $FlowFixMe[incompatible-use]
        highContrastDark: normalizeColor(dynamic.highContrastDark),
      },
    };
    return dynamicColor;
  }

  return null;
};

export const processColorObject = (
  color,
) => {
  if ('dynamic' in color && color.dynamic != null) {
    const processColor = require('./processColor');
    const dynamic = color.dynamic;
    const dynamicColor = {
      dynamic: {
        // $FlowFixMe[incompatible-use]
        light: processColor(dynamic.light),
        // $FlowFixMe[incompatible-use]
        dark: processColor(dynamic.dark),
        // $FlowFixMe[incompatible-use]
        highContrastLight: processColor(dynamic.highContrastLight),
        // $FlowFixMe[incompatible-use]
        highContrastDark: processColor(dynamic.highContrastDark),
      },
    };
    return dynamicColor;
  }
  return color;
};
