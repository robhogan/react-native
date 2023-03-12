/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @noformat
 *  strict-local
 * @generated SignedSource<<bda490a01513d4526005c1e029d5ce93>>
 *
 * This file was sync'd from the facebook/react repository.
 */

'use strict';

import {} from './ReactNativeTypes';
import invariant from 'invariant';

// Event configs
const customBubblingEventTypes = {};
const customDirectEventTypes = {};

exports.customBubblingEventTypes = customBubblingEventTypes;
exports.customDirectEventTypes = customDirectEventTypes;

const viewConfigCallbacks = new Map();
const viewConfigs = new Map();

function processEventTypes(viewConfig) {
  const {bubblingEventTypes, directEventTypes} = viewConfig;

  if (__DEV__) {
    if (bubblingEventTypes != null && directEventTypes != null) {
      for (const topLevelType in directEventTypes) {
        invariant(
          bubblingEventTypes[topLevelType] == null,
          'Event cannot be both direct and bubbling: %s',
          topLevelType,
        );
      }
    }
  }

  if (bubblingEventTypes != null) {
    for (const topLevelType in bubblingEventTypes) {
      if (customBubblingEventTypes[topLevelType] == null) {
        customBubblingEventTypes[topLevelType] =
          bubblingEventTypes[topLevelType];
      }
    }
  }

  if (directEventTypes != null) {
    for (const topLevelType in directEventTypes) {
      if (customDirectEventTypes[topLevelType] == null) {
        customDirectEventTypes[topLevelType] = directEventTypes[topLevelType];
      }
    }
  }
}

/**
 * Registers a native view/component by name.
 * A callback is provided to load the view config from UIManager.
 * The callback is deferred until the view is actually rendered.
 */
exports.register = function(name, callback) {
  invariant(
    !viewConfigCallbacks.has(name),
    'Tried to register two views with the same name %s',
    name,
  );
  invariant(
    typeof callback === 'function',
    'View config getter callback for component `%s` must be a function (received `%s`)',
    name,
    callback === null ? 'null' : typeof callback,
  );
  viewConfigCallbacks.set(name, callback);
  return name;
};

/**
 * Retrieves a config for the specified view.
 * If this is the first time the view has been used,
 * This configuration will be lazy-loaded from UIManager.
 */
exports.get = function(name) {
  let viewConfig;
  if (!viewConfigs.has(name)) {
    const callback = viewConfigCallbacks.get(name);
    if (typeof callback !== 'function') {
      invariant(
        false,
        'View config getter callback for component `%s` must be a function (received `%s`).%s',
        name,
        callback === null ? 'null' : typeof callback,
        typeof name[0] === 'string' && /[a-z]/.test(name[0])
          ? ' Make sure to start component names with a capital letter.'
          : '',
      );
    }
    viewConfig = callback();
    processEventTypes(viewConfig);
    viewConfigs.set(name, viewConfig);

    // Clear the callback after the config is set so that
    // we don't mask any errors during registration.
    viewConfigCallbacks.set(name, null);
  } else {
    viewConfig = viewConfigs.get(name);
  }
  invariant(viewConfig, 'View config not found for name %s', name);
  return viewConfig;
};
