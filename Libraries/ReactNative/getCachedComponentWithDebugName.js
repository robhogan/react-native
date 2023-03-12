/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *  strict
 * @format
 */



const cache = new Map();

export default function getCachedComponentWithDisplayName(
  displayName,
) {
  let ComponentWithDisplayName = cache.get(displayName);

  if (!ComponentWithDisplayName) {
    ComponentWithDisplayName = ({
      children,
    }) => children;
    // $FlowFixMe[prop-missing]
    ComponentWithDisplayName.displayName = displayName;
    cache.set(displayName, ComponentWithDisplayName);
  }

  return ComponentWithDisplayName;
}
