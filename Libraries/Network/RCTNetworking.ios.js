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

import RCTDeviceEventEmitter from '../EventEmitter/RCTDeviceEventEmitter';
import {} from '../vendor/emitter/EventEmitter';
import convertRequestBody, {} from './convertRequestBody';
import NativeNetworkingIOS from './NativeNetworkingIOS';
import {} from './XMLHttpRequest';


const RCTNetworking = {
  addListener(
    eventType,
    listener,
    context,
  ) {
    // $FlowFixMe[incompatible-call]
    return RCTDeviceEventEmitter.addListener(eventType, listener, context);
  },

  sendRequest(
    method,
    trackingName,
    url,
    headers,
    data,
    responseType,
    incrementalUpdates,
    timeout,
    callback,
    withCredentials,
  ) {
    const body = convertRequestBody(data);
    NativeNetworkingIOS.sendRequest(
      {
        method,
        url,
        data: {...body, trackingName},
        headers,
        responseType,
        incrementalUpdates,
        timeout,
        withCredentials,
      },
      callback,
    );
  },

  abortRequest(requestId) {
    NativeNetworkingIOS.abortRequest(requestId);
  },

  clearCookies(callback) {
    NativeNetworkingIOS.clearCookies(callback);
  },
};

module.exports = RCTNetworking;
