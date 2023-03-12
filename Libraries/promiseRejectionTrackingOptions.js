/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 *  strict
 */



let rejectionTrackingOptions = {
  allRejections: true,
  onUnhandled: (id, rejection = {}) => {
    let message;
    let stack;

    // $FlowFixMe[method-unbinding] added when improving typing for this parameters
    const stringValue = Object.prototype.toString.call(rejection);
    if (stringValue === '[object Error]') {
      // $FlowFixMe[method-unbinding] added when improving typing for this parameters
      message = Error.prototype.toString.call(rejection);
      const error = (rejection);
      stack = error.stack;
    } else {
      try {
        message = require('pretty-format')(rejection);
      } catch {
        message =
          typeof rejection === 'string'
            ? rejection
            : JSON.stringify((rejection));
      }
    }

    const warning =
      `Possible Unhandled Promise Rejection (id: ${id}):\n` +
      `${message ?? ''}\n` +
      (stack == null ? '' : stack);
    console.warn(warning);
  },
  onHandled: id => {
    const warning =
      `Promise Rejection Handled (id: ${id})\n` +
      'This means you can ignore any previous messages of the form ' +
      `"Possible Unhandled Promise Rejection (id: ${id}):"`;
    console.warn(warning);
  },
};

export default rejectionTrackingOptions;
