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

const defineLazyObjectProperty = require('./defineLazyObjectProperty');

/**
 * Sets an object's property. If a property with the same name exists, this will
 * replace it but maintain its descriptor configuration. The property will be
 * replaced with a lazy getter.
 *
 * In DEV mode the original property value will be preserved as `original[PropertyName]`
 * so that, if necessary, it can be restored. For example, if you want to route
 * network requests through DevTools (to trace them):
 *
 *   global.XMLHttpRequest = global.originalXMLHttpRequest;
 *
 * @see https://github.com/facebook/react-native/issues/934
 */
function polyfillObjectProperty(
  object,
  name,
  getValue,
) {
  const descriptor = Object.getOwnPropertyDescriptor(object, name);
  if (__DEV__ && descriptor) {
    const backupName = `original${name[0].toUpperCase()}${name.substr(1)}`;
    Object.defineProperty(object, backupName, descriptor);
  }

  const {enumerable, writable, configurable = false} = descriptor || {};
  if (descriptor && !configurable) {
    console.error('Failed to set polyfill. ' + name + ' is not configurable.');
    return;
  }

  defineLazyObjectProperty(object, name, {
    get: getValue,
    enumerable: enumerable !== false,
    writable: writable !== false,
  });
}

function polyfillGlobal(name, getValue) {
  polyfillObjectProperty(global, name, getValue);
}

module.exports = {polyfillObjectProperty, polyfillGlobal};
