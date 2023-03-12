/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 *  strict
 */

'use strict';


const getDevServer = require('./getDevServer');



async function symbolicateStackTrace(
  stack,
) {
  const devServer = getDevServer();
  if (!devServer.bundleLoadedFromServer) {
    throw new Error('Bundle was not loaded from Metro.');
  }

  // Lazy-load `fetch` until the first symbolication call to avoid circular requires.
  const fetch = global.fetch ?? require('../../Network/fetch');
  const response = await fetch(devServer.url + 'symbolicate', {
    method: 'POST',
    body: JSON.stringify({stack}),
  });
  return await response.json();
}

module.exports = symbolicateStackTrace;
