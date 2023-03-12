/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 *  strict-local
 */


import {} from './RootTag';

export function renderElement({
  element,
  rootTag,
  useFabric,
  useConcurrentRoot,
}) {
  if (useFabric) {
    require('../Renderer/shims/ReactFabric').render(
      element,
      rootTag,
      null,
      useConcurrentRoot,
    );
  } else {
    require('../Renderer/shims/ReactNative').render(element, rootTag);
  }
}

export function findHostInstance_DEPRECATED(
  componentOrHandle,
) {
  return require('../Renderer/shims/ReactNative').findHostInstance_DEPRECATED(
    componentOrHandle,
  );
}

export function findNodeHandle(
  componentOrHandle,
) {
  return require('../Renderer/shims/ReactNative').findNodeHandle(
    componentOrHandle,
  );
}

export function dispatchCommand(
  handle,
  command,
  args,
) {
  if (global.RN$Bridgeless === true) {
    // Note: this function has the same implementation in the legacy and new renderer.
    // However, evaluating the old renderer comes with some side effects.
    return require('../Renderer/shims/ReactFabric').dispatchCommand(
      handle,
      command,
      args,
    );
  } else {
    return require('../Renderer/shims/ReactNative').dispatchCommand(
      handle,
      command,
      args,
    );
  }
}

export function sendAccessibilityEvent(
  handle,
  eventType,
) {
  return require('../Renderer/shims/ReactNative').sendAccessibilityEvent(
    handle,
    eventType,
  );
}

/**
 * This method is used by AppRegistry to unmount a root when using the old
 * React Native renderer (Paper).
 */
export function unmountComponentAtNodeAndRemoveContainer(rootTag) {
  // $FlowExpectedError[incompatible-type] rootTag is an opaque type so we can't really cast it as is.
  const rootTagAsNumber = rootTag;
  require('../Renderer/shims/ReactNative').unmountComponentAtNodeAndRemoveContainer(
    rootTagAsNumber,
  );
}

export function unstable_batchedUpdates(
  fn,
  bookkeeping,
) {
  // This doesn't actually do anything when batching updates for a Fabric root.
  return require('../Renderer/shims/ReactNative').unstable_batchedUpdates(
    fn,
    bookkeeping,
  );
}

export function isProfilingRenderer() {
  return Boolean(__DEV__);
}
