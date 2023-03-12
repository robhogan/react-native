/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *  strict-local
 * @format
 */


import Platform from '../Utilities/Platform';


/**
 * In hybrid apps, use `nativeImageSource` to access images that are already
 * available on the native side, for example in Xcode Asset Catalogs or
 * Android's drawable folder.
 *
 * However, keep in mind that React Native Packager does not guarantee that the
 * image exists. If the image is missing you'll get an empty box. When adding
 * new images your app needs to be recompiled.
 *
 * Prefer Static Image Resources system which provides more guarantees,
 * automates measurements and allows adding new images without rebuilding the
 * native app. For more details visit:
 *
 *   https://reactnative.dev/docs/images
 *
 */
function nativeImageSource(spec) {
  let uri = Platform.select({
    android: spec.android,
    default: spec.default,
    ios: spec.ios,
  });
  if (uri == null) {
    console.warn(
      'nativeImageSource(...): No image name supplied for `%s`:\n%s',
      Platform.OS,
      JSON.stringify(spec, null, 2),
    );
    uri = '';
  }
  return {
    deprecated: true,
    height: spec.height,
    uri,
    width: spec.width,
  };
}

module.exports = nativeImageSource;
