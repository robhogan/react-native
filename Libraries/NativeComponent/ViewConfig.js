/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *  strict-local
 * @format
 */


import PlatformBaseViewConfig from './PlatformBaseViewConfig';

/**
 * Creates a complete `ViewConfig` from a `PartialViewConfig`.
 */
export function createViewConfig(
  partialViewConfig,
) {
  return {
    uiViewClassName: partialViewConfig.uiViewClassName,
    Commands: {},
    bubblingEventTypes: composeIndexers(
      PlatformBaseViewConfig.bubblingEventTypes,
      partialViewConfig.bubblingEventTypes,
    ),
    directEventTypes: composeIndexers(
      PlatformBaseViewConfig.directEventTypes,
      partialViewConfig.directEventTypes,
    ),
    validAttributes: composeIndexers(
      // $FlowFixMe[incompatible-call] `style` property confuses Flow.
      PlatformBaseViewConfig.validAttributes,
      // $FlowFixMe[incompatible-call] `style` property confuses Flow.
      partialViewConfig.validAttributes,
    ),
  };
}

function composeIndexers(
  maybeA,
  maybeB,
) {
  return maybeA == null || maybeB == null
    ? maybeA ?? maybeB ?? {}
    : {...maybeA, ...maybeB};
}
