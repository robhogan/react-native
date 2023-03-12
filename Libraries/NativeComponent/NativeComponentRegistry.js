/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *  strict-local
 * @format
 */

import * as StaticViewConfigValidator from './StaticViewConfigValidator';
import {createViewConfig} from './ViewConfig';
import UIManager from '../ReactNative/UIManager';
import ReactNativeViewConfigRegistry from '../Renderer/shims/ReactNativeViewConfigRegistry';
import getNativeComponentAttributes from '../ReactNative/getNativeComponentAttributes';
import verifyComponentAttributeEquivalence from '../Utilities/verifyComponentAttributeEquivalence';
import invariant from 'invariant';
import * as React from 'react';

let getRuntimeConfig;

/**
 * Configures a function that is called to determine whether a given component
 * should be registered using reflection of the native component at runtime.
 *
 * The provider should return null if the native component is unavailable in
 * the current environment.
 */
export function setRuntimeConfigProvider(
  runtimeConfigProvider,
) {
  invariant(
    getRuntimeConfig == null,
    'NativeComponentRegistry.setRuntimeConfigProvider() called more than once.',
  );
  getRuntimeConfig = runtimeConfigProvider;
}

/**
 * Gets a `NativeComponent` that can be rendered by React Native.
 *
 * The supplied `viewConfigProvider` may or may not be invoked and utilized,
 * depending on how `setRuntimeConfigProvider` is configured.
 */
export function get(
  name,
  viewConfigProvider,
) {
  ReactNativeViewConfigRegistry.register(name, () => {
    const {native, strict, verify} = getRuntimeConfig?.(name) ?? {
      native: true,
      strict: false,
      verify: false,
    };

    const viewConfig = native
      ? getNativeComponentAttributes(name)
      : createViewConfig(viewConfigProvider());

    if (verify) {
      const nativeViewConfig = native
        ? viewConfig
        : getNativeComponentAttributes(name);
      const staticViewConfig = native
        ? createViewConfig(viewConfigProvider())
        : viewConfig;

      if (strict) {
        const validationOutput = StaticViewConfigValidator.validate(
          name,
          nativeViewConfig,
          staticViewConfig,
        );

        if (validationOutput.type === 'invalid') {
          console.error(
            StaticViewConfigValidator.stringifyValidationResult(
              name,
              validationOutput,
            ),
          );
        }
      } else {
        verifyComponentAttributeEquivalence(nativeViewConfig, staticViewConfig);
      }
    }

    return viewConfig;
  });

  // $FlowFixMe[incompatible-return] `NativeComponent` is actually string!
  return name;
}

/**
 * Same as `NativeComponentRegistry.get(...)`, except this will check either
 * the `setRuntimeConfigProvider` configuration or use native reflection (slow)
 * to determine whether this native component is available.
 *
 * If the native component is not available, a stub component is returned. Note
 * that the return value of this is not `HostComponent` because the returned
 * component instance is not guaranteed to have native methods.
 */
export function getWithFallback_DEPRECATED(
  name,
  viewConfigProvider,
) {
  if (getRuntimeConfig == null) {
    // `getRuntimeConfig == null` when static view configs are disabled
    // If `setRuntimeConfigProvider` is not configured, use native reflection.
    if (hasNativeViewConfig(name)) {
      return get(name, viewConfigProvider);
    }
  } else {
    // If there is no runtime config, then the native component is unavailable.
    if (getRuntimeConfig(name) != null) {
      return get(name, viewConfigProvider);
    }
  }

  const FallbackNativeComponent = function (props) {
    return null;
  };
  FallbackNativeComponent.displayName = `Fallback(${name})`;
  return FallbackNativeComponent;
}

function hasNativeViewConfig(name) {
  invariant(getRuntimeConfig == null, 'Unexpected invocation!');
  return UIManager.getViewManagerConfig(name) != null;
}

/**
 * Unstable API. Do not use!
 *
 * This method returns if there is a StaticViewConfig registered for the
 * component name received as a parameter.
 */
export function unstable_hasStaticViewConfig(name) {
  const {native} = getRuntimeConfig?.(name) ?? {
    native: true,
  };
  return !native;
}
