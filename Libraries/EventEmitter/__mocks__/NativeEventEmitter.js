/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 *  strict-local
 */

import RCTDeviceEventEmitter from '../RCTDeviceEventEmitter';

/**
 * Mock `NativeEventEmitter` to ignore Native Modules.
 */
export default class NativeEventEmitter
{
  addListener(
    eventType,
    listener,
    context,
  ) {
    return RCTDeviceEventEmitter.addListener(eventType, listener, context);
  }

  emit(
    eventType,
    ...args
  ) {
    RCTDeviceEventEmitter.emit(eventType, ...args);
  }

  removeAllListeners(
    eventType,
  ) {
    RCTDeviceEventEmitter.removeAllListeners(eventType);
  }

  listenerCount(eventType) {
    return RCTDeviceEventEmitter.listenerCount(eventType);
  }
}
