/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 *  strict-local
 */

'use strict';


const XMLHttpRequest = require('../Network/XMLHttpRequest');
const InspectorAgent = require('./InspectorAgent');
const JSInspector = require('./JSInspector');




// We don't currently care about this













class Interceptor {
  _agent;
  _requests;

  constructor(agent) {
    this._agent = agent;
    this._requests = new Map();
  }

  getData(requestId) {
    return this._requests.get(requestId);
  }

  requestSent(id, url, method, headers) {
    const requestId = String(id);
    this._requests.set(requestId, '');

    const request = {
      url,
      method,
      headers,
      initialPriority: 'Medium',
    };
    const event = {
      requestId,
      documentURL: '',
      frameId: '1',
      loaderId: '1',
      request,
      timestamp: JSInspector.getTimestamp(),
      initiator: {
        // TODO(blom): Get stack trace
        // If type is 'script' the inspector will try to execute
        // `stack.callFrames[0]`
        type: 'other',
      },
      type: 'Other',
    };
    this._agent.sendEvent('requestWillBeSent', event);
  }

  responseReceived(id, url, status, headers) {
    const requestId = String(id);
    const response = {
      url,
      status,
      statusText: String(status),
      headers,
      // TODO(blom) refined headers, can we get this?
      requestHeaders: {},
      mimeType: this._getMimeType(headers),
      connectionReused: false,
      connectionId: -1,
      encodedDataLength: 0,
      securityState: 'unknown',
    };

    const event = {
      requestId,
      frameId: '1',
      loaderId: '1',
      timestamp: JSInspector.getTimestamp(),
      type: 'Other',
      response,
    };
    this._agent.sendEvent('responseReceived', event);
  }

  dataReceived(id, data) {
    const requestId = String(id);
    const existingData = this._requests.get(requestId) || '';
    this._requests.set(requestId, existingData.concat(data));
    const event = {
      requestId,
      timestamp: JSInspector.getTimestamp(),
      dataLength: data.length,
      encodedDataLength: data.length,
    };
    this._agent.sendEvent('dataReceived', event);
  }

  loadingFinished(id, encodedDataLength) {
    const event = {
      requestId: String(id),
      timestamp: JSInspector.getTimestamp(),
      encodedDataLength: encodedDataLength,
    };
    this._agent.sendEvent('loadingFinished', event);
  }

  loadingFailed(id, error) {
    const event = {
      requestId: String(id),
      timestamp: JSInspector.getTimestamp(),
      type: 'Other',
      errorText: error,
    };
    this._agent.sendEvent('loadingFailed', event);
  }

  _getMimeType(headers) {
    const contentType = headers['Content-Type'] || '';
    return contentType.split(';')[0];
  }
}


class NetworkAgent extends InspectorAgent {
  static DOMAIN = 'Network';

  _sendEvent;
  _interceptor;

  enable({maxResourceBufferSize, maxTotalBufferSize}) {
    this._interceptor = new Interceptor(this);
    XMLHttpRequest.setInterceptor(this._interceptor);
  }

  disable() {
    XMLHttpRequest.setInterceptor(null);
    this._interceptor = null;
  }

  getResponseBody({requestId}) {
    return {body: this.interceptor().getData(requestId), base64Encoded: false};
  }

  interceptor() {
    if (this._interceptor) {
      return this._interceptor;
    } else {
      throw Error('_interceptor can not be null');
    }
  }
}

module.exports = NetworkAgent;
