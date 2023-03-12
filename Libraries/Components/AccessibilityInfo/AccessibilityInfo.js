/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *  strict-local
 * @format
 */

import RCTDeviceEventEmitter from '../../EventEmitter/RCTDeviceEventEmitter';
import {sendAccessibilityEvent} from '../../Renderer/shims/ReactNative';
import Platform from '../../Utilities/Platform';
import NativeAccessibilityInfoAndroid from './NativeAccessibilityInfo';
import NativeAccessibilityManagerIOS from './NativeAccessibilityManager';
import legacySendAccessibilityEvent from './legacySendAccessibilityEvent';

// Events that are only supported on Android.

// Events that are only supported on iOS.



// Mapping of public event names to platform-specific event names.
const EventNames = Platform.OS === 'android'
  ? new Map([
      ['change', 'touchExplorationDidChange'],
      ['reduceMotionChanged', 'reduceMotionDidChange'],
      ['screenReaderChanged', 'touchExplorationDidChange'],
      ['accessibilityServiceChanged', 'accessibilityServiceDidChange'],
    ])
  : new Map([
      ['announcementFinished', 'announcementFinished'],
      ['boldTextChanged', 'boldTextChanged'],
      ['change', 'screenReaderChanged'],
      ['grayscaleChanged', 'grayscaleChanged'],
      ['invertColorsChanged', 'invertColorsChanged'],
      ['reduceMotionChanged', 'reduceMotionChanged'],
      ['reduceTransparencyChanged', 'reduceTransparencyChanged'],
      ['screenReaderChanged', 'screenReaderChanged'],
    ]);

/**
 * Sometimes it's useful to know whether or not the device has a screen reader
 * that is currently active. The `AccessibilityInfo` API is designed for this
 * purpose. You can use it to query the current state of the screen reader as
 * well as to register to be notified when the state of the screen reader
 * changes.
 *
 * See https://reactnative.dev/docs/accessibilityinfo
 */
const AccessibilityInfo = {
  /**
   * Query whether bold text is currently enabled.
   *
   * Returns a promise which resolves to a boolean.
   * The result is `true` when bold text is enabled and `false` otherwise.
   *
   * See https://reactnative.dev/docs/accessibilityinfo#isBoldTextEnabled
   */
  isBoldTextEnabled() {
    if (Platform.OS === 'android') {
      return Promise.resolve(false);
    } else {
      return new Promise((resolve, reject) => {
        if (NativeAccessibilityManagerIOS != null) {
          NativeAccessibilityManagerIOS.getCurrentBoldTextState(
            resolve,
            reject,
          );
        } else {
          reject(null);
        }
      });
    }
  },

  /**
   * Query whether grayscale is currently enabled.
   *
   * Returns a promise which resolves to a boolean.
   * The result is `true` when grayscale is enabled and `false` otherwise.
   *
   * See https://reactnative.dev/docs/accessibilityinfo#isGrayscaleEnabled
   */
  isGrayscaleEnabled() {
    if (Platform.OS === 'android') {
      return Promise.resolve(false);
    } else {
      return new Promise((resolve, reject) => {
        if (NativeAccessibilityManagerIOS != null) {
          NativeAccessibilityManagerIOS.getCurrentGrayscaleState(
            resolve,
            reject,
          );
        } else {
          reject(null);
        }
      });
    }
  },

  /**
   * Query whether inverted colors are currently enabled.
   *
   * Returns a promise which resolves to a boolean.
   * The result is `true` when invert color is enabled and `false` otherwise.
   *
   * See https://reactnative.dev/docs/accessibilityinfo#isInvertColorsEnabled
   */
  isInvertColorsEnabled() {
    if (Platform.OS === 'android') {
      return Promise.resolve(false);
    } else {
      return new Promise((resolve, reject) => {
        if (NativeAccessibilityManagerIOS != null) {
          NativeAccessibilityManagerIOS.getCurrentInvertColorsState(
            resolve,
            reject,
          );
        } else {
          reject(null);
        }
      });
    }
  },

  /**
   * Query whether reduced motion is currently enabled.
   *
   * Returns a promise which resolves to a boolean.
   * The result is `true` when a reduce motion is enabled and `false` otherwise.
   *
   * See https://reactnative.dev/docs/accessibilityinfo#isReduceMotionEnabled
   */
  isReduceMotionEnabled() {
    return new Promise((resolve, reject) => {
      if (Platform.OS === 'android') {
        if (NativeAccessibilityInfoAndroid != null) {
          NativeAccessibilityInfoAndroid.isReduceMotionEnabled(resolve);
        } else {
          reject(null);
        }
      } else {
        if (NativeAccessibilityManagerIOS != null) {
          NativeAccessibilityManagerIOS.getCurrentReduceMotionState(
            resolve,
            reject,
          );
        } else {
          reject(null);
        }
      }
    });
  },

  /**
   * Query whether reduce motion and prefer cross-fade transitions settings are currently enabled.
   *
   * Returns a promise which resolves to a boolean.
   * The result is `true` when  prefer cross-fade transitions is enabled and `false` otherwise.
   *
   * See https://reactnative.dev/docs/accessibilityinfo#prefersCrossFadeTransitions
   */
  prefersCrossFadeTransitions() {
    return new Promise((resolve, reject) => {
      if (Platform.OS === 'android') {
        return Promise.resolve(false);
      } else {
        if (
          NativeAccessibilityManagerIOS?.getCurrentPrefersCrossFadeTransitionsState !=
          null
        ) {
          NativeAccessibilityManagerIOS.getCurrentPrefersCrossFadeTransitionsState(
            resolve,
            reject,
          );
        } else {
          reject(null);
        }
      }
    });
  },

  /**
   * Query whether reduced transparency is currently enabled.
   *
   * Returns a promise which resolves to a boolean.
   * The result is `true` when a reduce transparency is enabled and `false` otherwise.
   *
   * See https://reactnative.dev/docs/accessibilityinfo#isReduceTransparencyEnabled
   */
  isReduceTransparencyEnabled() {
    if (Platform.OS === 'android') {
      return Promise.resolve(false);
    } else {
      return new Promise((resolve, reject) => {
        if (NativeAccessibilityManagerIOS != null) {
          NativeAccessibilityManagerIOS.getCurrentReduceTransparencyState(
            resolve,
            reject,
          );
        } else {
          reject(null);
        }
      });
    }
  },

  /**
   * Query whether a screen reader is currently enabled.
   *
   * Returns a promise which resolves to a boolean.
   * The result is `true` when a screen reader is enabled and `false` otherwise.
   *
   * See https://reactnative.dev/docs/accessibilityinfo#isScreenReaderEnabled
   */
  isScreenReaderEnabled() {
    return new Promise((resolve, reject) => {
      if (Platform.OS === 'android') {
        if (NativeAccessibilityInfoAndroid != null) {
          NativeAccessibilityInfoAndroid.isTouchExplorationEnabled(resolve);
        } else {
          reject(null);
        }
      } else {
        if (NativeAccessibilityManagerIOS != null) {
          NativeAccessibilityManagerIOS.getCurrentVoiceOverState(
            resolve,
            reject,
          );
        } else {
          reject(null);
        }
      }
    });
  },

  /**
   * Query whether Accessibility Service is currently enabled.
   *
   * Returns a promise which resolves to a boolean.
   * The result is `true` when any service is enabled and `false` otherwise.
   *
   * @platform android
   *
   * See https://reactnative.dev/docs/accessibilityinfo/#isaccessibilityserviceenabled-android
   */
  isAccessibilityServiceEnabled() {
    return new Promise((resolve, reject) => {
      if (Platform.OS === 'android') {
        if (
          NativeAccessibilityInfoAndroid != null &&
          NativeAccessibilityInfoAndroid.isAccessibilityServiceEnabled != null
        ) {
          NativeAccessibilityInfoAndroid.isAccessibilityServiceEnabled(resolve);
        } else {
          reject(null);
        }
      } else {
        reject(null);
      }
    });
  },

  /**
   * Add an event handler. Supported events:
   *
   * - `reduceMotionChanged`: Fires when the state of the reduce motion toggle changes.
   *   The argument to the event handler is a boolean. The boolean is `true` when a reduce
   *   motion is enabled (or when "Transition Animation Scale" in "Developer options" is
   *   "Animation off") and `false` otherwise.
   * - `screenReaderChanged`: Fires when the state of the screen reader changes. The argument
   *   to the event handler is a boolean. The boolean is `true` when a screen
   *   reader is enabled and `false` otherwise.
   *
   * These events are only supported on iOS:
   *
   * - `boldTextChanged`: iOS-only event. Fires when the state of the bold text toggle changes.
   *   The argument to the event handler is a boolean. The boolean is `true` when a bold text
   *   is enabled and `false` otherwise.
   * - `grayscaleChanged`: iOS-only event. Fires when the state of the gray scale toggle changes.
   *   The argument to the event handler is a boolean. The boolean is `true` when a gray scale
   *   is enabled and `false` otherwise.
   * - `invertColorsChanged`: iOS-only event. Fires when the state of the invert colors toggle
   *   changes. The argument to the event handler is a boolean. The boolean is `true` when a invert
   *   colors is enabled and `false` otherwise.
   * - `reduceTransparencyChanged`: iOS-only event. Fires when the state of the reduce transparency
   *   toggle changes.  The argument to the event handler is a boolean. The boolean is `true`
   *   when a reduce transparency is enabled and `false` otherwise.
   * - `announcementFinished`: iOS-only event. Fires when the screen reader has
   *   finished making an announcement. The argument to the event handler is a
   *   dictionary with these keys:
   *     - `announcement`: The string announced by the screen reader.
   *     - `success`: A boolean indicating whether the announcement was
   *       successfully made.
   *
   * See https://reactnative.dev/docs/accessibilityinfo#addeventlistener
   */
  addEventListener(
    eventName,
    // $FlowIssue[incompatible-type] - Flow bug with unions and generics (T128099423)
    handler,
  ) {
    const deviceEventName = EventNames.get(eventName);
    return deviceEventName == null
      ? {remove() {}}
      : RCTDeviceEventEmitter.addListener(deviceEventName, handler);
  },

  /**
   * Set accessibility focus to a React component.
   *
   * See https://reactnative.dev/docs/accessibilityinfo#setaccessibilityfocus
   */
  setAccessibilityFocus(reactTag) {
    legacySendAccessibilityEvent(reactTag, 'focus');
  },

  /**
   * Send a named accessibility event to a HostComponent.
   */
  sendAccessibilityEvent(
    handle,
    eventType,
  ) {
    // iOS only supports 'focus' event types
    if (Platform.OS === 'ios' && eventType === 'click') {
      return;
    }
    // route through React renderer to distinguish between Fabric and non-Fabric handles
    sendAccessibilityEvent(handle, eventType);
  },

  /**
   * Post a string to be announced by the screen reader.
   *
   * See https://reactnative.dev/docs/accessibilityinfo#announceforaccessibility
   */
  announceForAccessibility(announcement) {
    if (Platform.OS === 'android') {
      NativeAccessibilityInfoAndroid?.announceForAccessibility(announcement);
    } else {
      NativeAccessibilityManagerIOS?.announceForAccessibility(announcement);
    }
  },

  /**
   * Post a string to be announced by the screen reader.
   * - `announcement`: The string announced by the screen reader.
   * - `options`: An object that configures the reading options.
   *   - `queue`: The announcement will be queued behind existing announcements. iOS only.
   */
  announceForAccessibilityWithOptions(
    announcement,
    options,
  ) {
    if (Platform.OS === 'android') {
      NativeAccessibilityInfoAndroid?.announceForAccessibility(announcement);
    } else {
      if (NativeAccessibilityManagerIOS?.announceForAccessibilityWithOptions) {
        NativeAccessibilityManagerIOS?.announceForAccessibilityWithOptions(
          announcement,
          options,
        );
      } else {
        NativeAccessibilityManagerIOS?.announceForAccessibility(announcement);
      }
    }
  },

  /**
   * Get the recommended timeout for changes to the UI needed by this user.
   *
   * See https://reactnative.dev/docs/accessibilityinfo#getrecommendedtimeoutmillis
   */
  getRecommendedTimeoutMillis(originalTimeout) {
    if (Platform.OS === 'android') {
      return new Promise((resolve, reject) => {
        if (NativeAccessibilityInfoAndroid?.getRecommendedTimeoutMillis) {
          NativeAccessibilityInfoAndroid.getRecommendedTimeoutMillis(
            originalTimeout,
            resolve,
          );
        } else {
          resolve(originalTimeout);
        }
      });
    } else {
      return Promise.resolve(originalTimeout);
    }
  },
};

export default AccessibilityInfo;
