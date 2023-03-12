/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *  strict
 * @format
 */

'use strict';

/**
 * Keep this in sync with `DeprecatedImageSourcePropType.js`.
 *
 * This type is intentionally inexact in order to permit call sites that supply
 * extra properties.
 */



export function getImageSourceProperties(
  imageSource,
) {
  const object = {};
  if (imageSource.body != null) {
    object.body = imageSource.body;
  }
  if (imageSource.bundle != null) {
    object.bundle = imageSource.bundle;
  }
  if (imageSource.cache != null) {
    object.cache = imageSource.cache;
  }
  if (imageSource.headers != null) {
    object.headers = imageSource.headers;
  }
  if (imageSource.height != null) {
    object.height = imageSource.height;
  }
  if (imageSource.method != null) {
    object.method = imageSource.method;
  }
  if (imageSource.scale != null) {
    object.scale = imageSource.scale;
  }
  if (imageSource.uri != null) {
    object.uri = imageSource.uri;
  }
  if (imageSource.width != null) {
    object.width = imageSource.width;
  }
  return object;
}
