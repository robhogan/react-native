/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */

'use strict';

import {unstable_hasComponent} from 'react-native/Libraries/NativeComponent/NativeComponentRegistryUnstable';

const errorMessageForMethod = (methodName) =>
  "[ReactNative Architecture][JS] '" +
  methodName +
  "' is not available in the new React Native architecture.";

module.exports = {
  getViewManagerConfig: (viewManagerName) => {
    console.error(
      errorMessageForMethod('getViewManagerConfig') +
        'Use hasViewManagerConfig instead. viewManagerName: ' +
        viewManagerName,
    );
    return null;
  },
  hasViewManagerConfig: (viewManagerName) => {
    return unstable_hasComponent(viewManagerName);
  },
  getConstants: () => {
    console.error(errorMessageForMethod('getConstants'));
    return {};
  },
  getConstantsForViewManager: (viewManagerName) => {
    console.error(errorMessageForMethod('getConstantsForViewManager'));
    return {};
  },
  getDefaultEventTypes: () => {
    console.error(errorMessageForMethod('getDefaultEventTypes'));
    return [];
  },
  lazilyLoadView: (name) => {
    console.error(errorMessageForMethod('lazilyLoadView'));
    return {};
  },
  createView: (
    reactTag,
    viewName,
    rootTag,
    props,
  ) => console.error(errorMessageForMethod('createView')),
  updateView: (reactTag, viewName, props) =>
    console.error(errorMessageForMethod('updateView')),
  focus: (reactTag) =>
    console.error(errorMessageForMethod('focus')),
  blur: (reactTag) =>
    console.error(errorMessageForMethod('blur')),
  findSubviewIn: (
    reactTag,
    point,
    callback,
  ) => console.error(errorMessageForMethod('findSubviewIn')),
  dispatchViewManagerCommand: (
    reactTag,
    commandID,
    commandArgs,
  ) => console.error(errorMessageForMethod('dispatchViewManagerCommand')),
  measure: (
    reactTag,
    callback,
  ) => console.error(errorMessageForMethod('measure')),
  measureInWindow: (
    reactTag,
    callback,
  ) => console.error(errorMessageForMethod('measureInWindow')),
  viewIsDescendantOf: (
    reactTag,
    ancestorReactTag,
    callback,
  ) => console.error(errorMessageForMethod('viewIsDescendantOf')),
  measureLayout: (
    reactTag,
    ancestorReactTag,
    errorCallback,
    callback,
  ) => console.error(errorMessageForMethod('measureLayout')),
  measureLayoutRelativeToParent: (
    reactTag,
    errorCallback,
    callback,
  ) =>
    console.error(errorMessageForMethod('measureLayoutRelativeToParent')),
  setJSResponder: (reactTag, blockNativeResponder) =>
    console.error(errorMessageForMethod('setJSResponder')),
  clearJSResponder: () => {}, // Don't log error here because we're aware it gets called
  configureNextLayoutAnimation: (
    config,
    callback,
    errorCallback,
  ) =>
    console.error(errorMessageForMethod('configureNextLayoutAnimation')),
  removeSubviewsFromContainerWithID: (containerID) =>
    console.error(errorMessageForMethod('removeSubviewsFromContainerWithID')),
  replaceExistingNonRootView: (reactTag, newReactTag) =>
    console.error(errorMessageForMethod('replaceExistingNonRootView')),
  setChildren: (containerTag, reactTags) =>
    console.error(errorMessageForMethod('setChildren')),
  manageChildren: (
    containerTag,
    moveFromIndices,
    moveToIndices,
    addChildReactTags,
    addAtIndices,
    removeAtIndices,
  ) => console.error(errorMessageForMethod('manageChildren')),

  // Android only
  setLayoutAnimationEnabledExperimental: (enabled) => {
    console.error(
      errorMessageForMethod('setLayoutAnimationEnabledExperimental'),
    );
  },
  // Please use AccessibilityInfo.sendAccessibilityEvent instead.
  // See SetAccessibilityFocusExample in AccessibilityExample.js for a migration example.
  sendAccessibilityEvent: (reactTag, eventType) =>
    console.error(errorMessageForMethod('sendAccessibilityEvent')),
  showPopupMenu: (
    reactTag,
    items,
    error,
    success,
  ) => console.error(errorMessageForMethod('showPopupMenu')),
  dismissPopupMenu: () =>
    console.error(errorMessageForMethod('dismissPopupMenu')),
};
