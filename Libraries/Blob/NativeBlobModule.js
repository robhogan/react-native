/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */

import * as TurboModuleRegistry from '../TurboModule/TurboModuleRegistry';


const NativeModule = TurboModuleRegistry.get('BlobModule');

let constants = null;
let NativeBlobModule = null;

if (NativeModule != null) {
  NativeBlobModule = {
    getConstants() {
      if (constants == null) {
        constants = NativeModule.getConstants();
      }
      return constants;
    },
    addNetworkingHandler() {
      NativeModule.addNetworkingHandler();
    },
    addWebSocketHandler(id) {
      NativeModule.addWebSocketHandler(id);
    },
    removeWebSocketHandler(id) {
      NativeModule.removeWebSocketHandler(id);
    },
    sendOverSocket(blob, socketID) {
      NativeModule.sendOverSocket(blob, socketID);
    },
    createFromParts(parts, withId) {
      NativeModule.createFromParts(parts, withId);
    },
    release(blobId) {
      NativeModule.release(blobId);
    },
  };
}

export default (NativeBlobModule);
