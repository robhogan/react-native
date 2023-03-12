/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *  strict
 * @format
 */

const NativeModules = require('../BatchedBridge/NativeModules');
import invariant from 'invariant';

const turboModuleProxy = global.__turboModuleProxy;

function requireModule(name) {
  // Bridgeless mode requires TurboModules
  if (global.RN$Bridgeless !== true) {
    // Backward compatibility layer during migration.
    const legacyModule = NativeModules[name];
    if (legacyModule != null) {
      return ((legacyModule));
    }
  }

  if (turboModuleProxy != null) {
    const module = turboModuleProxy(name);
    return module;
  }

  return null;
}

export function get(name) {
  return requireModule(name);
}

export function getEnforcing(name) {
  const module = requireModule(name);
  invariant(
    module != null,
    `TurboModuleRegistry.getEnforcing(...): '${name}' could not be found. ` +
      'Verify that a module by this name is registered in the native binary.',
  );
  return module;
}
