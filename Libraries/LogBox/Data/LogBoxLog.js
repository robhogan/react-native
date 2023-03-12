/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *  strict
 * @format
 */

import * as LogBoxSymbolication from './LogBoxSymbolication';





class LogBoxLog {
  message;
  type;
  category;
  componentStack;
  stack;
  count;
  level;
  codeFrame;
  isComponentError;
  symbolicated = {
    error: null,
    stack: null,
    status: 'NONE',
  };

  constructor(data) {
    this.level = data.level;
    this.type = data.type;
    this.message = data.message;
    this.stack = data.stack;
    this.category = data.category;
    this.componentStack = data.componentStack;
    this.codeFrame = data.codeFrame;
    this.isComponentError = data.isComponentError;
    this.count = 1;
  }

  incrementCount() {
    this.count += 1;
  }

  getAvailableStack() {
    return this.symbolicated.status === 'COMPLETE'
      ? this.symbolicated.stack
      : this.stack;
  }

  retrySymbolicate(callback) {
    if (this.symbolicated.status !== 'COMPLETE') {
      LogBoxSymbolication.deleteStack(this.stack);
      this.handleSymbolicate(callback);
    }
  }

  symbolicate(callback) {
    if (this.symbolicated.status === 'NONE') {
      this.handleSymbolicate(callback);
    }
  }

  handleSymbolicate(callback) {
    if (this.symbolicated.status !== 'PENDING') {
      this.updateStatus(null, null, null, callback);
      LogBoxSymbolication.symbolicate(this.stack).then(
        data => {
          this.updateStatus(null, data?.stack, data?.codeFrame, callback);
        },
        error => {
          this.updateStatus(error, null, null, callback);
        },
      );
    }
  }

  updateStatus(
    error,
    stack,
    codeFrame,
    callback,
  ) {
    const lastStatus = this.symbolicated.status;
    if (error != null) {
      this.symbolicated = {
        error,
        stack: null,
        status: 'FAILED',
      };
    } else if (stack != null) {
      if (codeFrame) {
        this.codeFrame = codeFrame;
      }

      this.symbolicated = {
        error: null,
        stack,
        status: 'COMPLETE',
      };
    } else {
      this.symbolicated = {
        error: null,
        stack: null,
        status: 'PENDING',
      };
    }

    if (callback && lastStatus !== this.symbolicated.status) {
      callback(this.symbolicated.status);
    }
  }
}

export default LogBoxLog;
