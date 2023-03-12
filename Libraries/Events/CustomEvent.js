/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 *  strict-local
 */

// Make sure global Event is defined
import EventPolyfill from './EventPolyfill';


class CustomEvent extends EventPolyfill {
  detail;

  constructor(typeArg, options) {
    const {bubbles, cancelable, composed} = options;
    super(typeArg, {bubbles, cancelable, composed});

    this.detail = options.detail; // this would correspond to `NativeEvent` in SyntheticEvent
  }
}

export default CustomEvent;
