/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *  strict
 * @format
 */


import * as TurboModuleRegistry from '../TurboModule/TurboModuleRegistry';

const Platform = require('../Utilities/Platform');


const NativeModule =
  TurboModuleRegistry.getEnforcing('ExceptionsManager');

const ExceptionsManager = {
  reportFatalException(
    message,
    stack,
    exceptionId,
  ) {
    NativeModule.reportFatalException(message, stack, exceptionId);
  },
  reportSoftException(
    message,
    stack,
    exceptionId,
  ) {
    NativeModule.reportSoftException(message, stack, exceptionId);
  },
  updateExceptionMessage(
    message,
    stack,
    exceptionId,
  ) {
    NativeModule.updateExceptionMessage(message, stack, exceptionId);
  },
  dismissRedbox() {
    if (Platform.OS !== 'ios' && NativeModule.dismissRedbox) {
      // TODO(T53311281): This is a noop on iOS now. Implement it.
      NativeModule.dismissRedbox();
    }
  },
  reportException(data) {
    if (NativeModule.reportException) {
      NativeModule.reportException(data);
      return;
    }
    if (data.isFatal) {
      ExceptionsManager.reportFatalException(data.message, data.stack, data.id);
    } else {
      ExceptionsManager.reportSoftException(data.message, data.stack, data.id);
    }
  },
};

export default ExceptionsManager;
