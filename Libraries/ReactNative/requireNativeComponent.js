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


const createReactNativeComponentClass = require('../Renderer/shims/createReactNativeComponentClass');
const getNativeComponentAttributes = require('./getNativeComponentAttributes');

/**
 * Creates values that can be used like React components which represent native
 * view managers. You should create JavaScript modules that wrap these values so
 * that the results are memoized. Example:
 *
 *   const View = requireNativeComponent('RCTView');
 *
 */

const requireNativeComponent =(uiViewClassName) =>
  ((createReactNativeComponentClass(uiViewClassName, () =>
    getNativeComponentAttributes(uiViewClassName),
  )));

module.exports = requireNativeComponent;
