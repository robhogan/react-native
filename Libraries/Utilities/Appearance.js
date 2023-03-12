/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 *  strict-local
 */

import EventEmitter, {
} from '../vendor/emitter/EventEmitter';
import NativeEventEmitter from '../EventEmitter/NativeEventEmitter';
import NativeAppearance, {
} from './NativeAppearance';
import invariant from 'invariant';
import {isAsyncDebugging} from './DebugEnvironment';
import Platform from '../Utilities/Platform';

const eventEmitter = new EventEmitter();


if (NativeAppearance) {
  const nativeEventEmitter =
    new NativeEventEmitter(
      // T88715063: NativeEventEmitter only used this parameter on iOS. Now it uses it on all platforms, so this code was modified automatically to preserve its behavior
      // If you want to use the native module on other platforms, please remove this condition and test its behavior
      Platform.OS !== 'ios' ? null : NativeAppearance,
    );
  nativeEventEmitter.addListener(
    'appearanceChanged',
    (newAppearance) => {
      const {colorScheme} = newAppearance;
      invariant(
        colorScheme === 'dark' ||
          colorScheme === 'light' ||
          colorScheme == null,
        "Unrecognized color scheme. Did you mean 'dark' or 'light'?",
      );
      eventEmitter.emit('change', {colorScheme});
    },
  );
}

module.exports = {
  /**
   * Note: Although color scheme is available immediately, it may change at any
   * time. Any rendering logic or styles that depend on this should try to call
   * this function on every render, rather than caching the value (for example,
   * using inline styles rather than setting a value in a `StyleSheet`).
   *
   * Example: `const colorScheme = Appearance.getColorScheme();`
   *
   * @returns {?ColorSchemeName} Value for the color scheme preference.
   */
  getColorScheme() {
    if (__DEV__) {
      if (isAsyncDebugging) {
        // Hard code light theme when using the async debugger as
        // sync calls aren't supported
        return 'light';
      }
    }

    // TODO: (hramos) T52919652 Use ?ColorSchemeName once codegen supports union
    const nativeColorScheme =
      NativeAppearance == null
        ? null
        : NativeAppearance.getColorScheme() || null;
    invariant(
      nativeColorScheme === 'dark' ||
        nativeColorScheme === 'light' ||
        nativeColorScheme == null,
      "Unrecognized color scheme. Did you mean 'dark' or 'light'?",
    );
    return nativeColorScheme;
  },

  /**
   * Add an event handler that is fired when appearance preferences change.
   */
  addChangeListener(listener) {
    return eventEmitter.addListener('change', listener);
  },
};
