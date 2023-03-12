/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 *  strict-local
 */

// TODO: move this file to shims/ReactNative (requires React update and sync)


import requireNativeComponent from '../../Libraries/ReactNative/requireNativeComponent';
import UIManager from '../ReactNative/UIManager';

// TODO: import from CodegenSchema once workspaces are enabled


// If this function runs then that means the view configs were not
// generated at build time using `GenerateViewConfigJs.js`. Thus
// we need to `requireNativeComponent` to get the view configs from view managers.
// `requireNativeComponent` is not available in Bridgeless mode.
// e.g. This function runs at runtime if `codegenNativeComponent` was not called
// from a file suffixed with NativeComponent.js.
function codegenNativeComponent(
  componentName,
  options,
) {
  if (global.RN$Bridgeless === true) {
    const errorMessage =
      "Native Component '" +
      componentName +
      "' that calls codegenNativeComponent was not code generated at build time. Please check its definition.";
    console.error(errorMessage);
  }

  let componentNameInUse =
    options && options.paperComponentName != null
      ? options.paperComponentName
      : componentName;

  if (options != null && options.paperComponentNameDeprecated != null) {
    if (UIManager.hasViewManagerConfig(componentName)) {
      componentNameInUse = componentName;
    } else if (
      options.paperComponentNameDeprecated != null &&
      UIManager.hasViewManagerConfig(options.paperComponentNameDeprecated)
    ) {
      // $FlowFixMe[incompatible-type]
      componentNameInUse = options.paperComponentNameDeprecated;
    } else {
      throw new Error(
        `Failed to find native component for either ${componentName} or ${
          options.paperComponentNameDeprecated ?? '(unknown)'
        }`,
      );
    }
  }

  return (requireNativeComponent(
    // $FlowFixMe[incompatible-call]
    componentNameInUse,
  ));
}

export default codegenNativeComponent;
