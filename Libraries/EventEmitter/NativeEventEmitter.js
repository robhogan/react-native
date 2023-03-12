/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *  strict-local
 * @format
 */

'use strict';

import Platform from '../Utilities/Platform';
import RCTDeviceEventEmitter from './RCTDeviceEventEmitter';
import invariant from 'invariant';



/**
 * `NativeEventEmitter` is intended for use by Native Modules to emit events to
 * JavaScript listeners. If a `NativeModule` is supplied to the constructor, it
 * will be notified (via `addListener` and `removeListeners`) when the listener
 * count changes to manage "native memory".
 *
 * Currently, all native events are fired via a global `RCTDeviceEventEmitter`.
 * This means event names must be globally unique, and it means that call sites
 * can theoretically listen to `RCTDeviceEventEmitter` (although discouraged).
 */
export default class NativeEventEmitter
{
  _nativeModule;

  constructor(nativeModule) {
    if (Platform.OS === 'ios') {
      invariant(
        nativeModule != null,
        '`new NativeEventEmitter()` requires a non-null argument.',
      );
    }

    const hasAddListener =
      // $FlowFixMe[method-unbinding] added when improving typing for this parameters
      !!nativeModule && typeof nativeModule.addListener === 'function';
    const hasRemoveListeners =
      // $FlowFixMe[method-unbinding] added when improving typing for this parameters
      !!nativeModule && typeof nativeModule.removeListeners === 'function';

    if (nativeModule && hasAddListener && hasRemoveListeners) {
      this._nativeModule = nativeModule;
    } else if (nativeModule != null) {
      if (!hasAddListener) {
        console.warn(
          '`new NativeEventEmitter()` was called with a non-null argument without the required `addListener` method.',
        );
      }
      if (!hasRemoveListeners) {
        console.warn(
          '`new NativeEventEmitter()` was called with a non-null argument without the required `removeListeners` method.',
        );
      }
    }
  }

  addListener(
    eventType,
    listener,
    context,
  ) {
    this._nativeModule?.addListener(eventType);
    let subscription = RCTDeviceEventEmitter.addListener(
      eventType,
      listener,
      context,
    );

    return {
      remove: () => {
        if (subscription != null) {
          this._nativeModule?.removeListeners(1);
          // $FlowFixMe[incompatible-use]
          subscription.remove();
          subscription = null;
        }
      },
    };
  }

  emit(
    eventType,
    ...args
  ) {
    // Generally, `RCTDeviceEventEmitter` is directly invoked. But this is
    // included for completeness.
    RCTDeviceEventEmitter.emit(eventType, ...args);
  }

  removeAllListeners(
    eventType,
  ) {
    invariant(
      eventType != null,
      '`NativeEventEmitter.removeAllListener()` requires a non-null argument.',
    );
    this._nativeModule?.removeListeners(this.listenerCount(eventType));
    RCTDeviceEventEmitter.removeAllListeners(eventType);
  }

  listenerCount(eventType) {
    return RCTDeviceEventEmitter.listenerCount(eventType);
  }
}
