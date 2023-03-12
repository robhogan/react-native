/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 *  strict
 */

import NativeSourceCode from '../../NativeModules/specs/NativeSourceCode';

let _cachedDevServerURL;
let _cachedFullBundleURL;
const FALLBACK = 'http://localhost:8081/';


/**
 * Many RN development tools rely on the development server (packager) running
 * @return URL to packager with trailing slash
 */
function getDevServer() {
  if (_cachedDevServerURL === undefined) {
    const scriptUrl = NativeSourceCode.getConstants().scriptURL;
    const match = scriptUrl.match(/^https?:\/\/.*?\//);
    _cachedDevServerURL = match ? match[0] : null;
    _cachedFullBundleURL = match ? scriptUrl : null;
  }

  return {
    url: _cachedDevServerURL ?? FALLBACK,
    fullBundleUrl: _cachedFullBundleURL,
    bundleLoadedFromServer: _cachedDevServerURL !== null,
  };
}

module.exports = getDevServer;
