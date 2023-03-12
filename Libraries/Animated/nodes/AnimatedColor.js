/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */

'use strict';

import AnimatedValue from './AnimatedValue';
import AnimatedWithChildren from './AnimatedWithChildren';
import normalizeColor from '../../StyleSheet/normalizeColor';
import {processColorObject} from '../../StyleSheet/PlatformColorValueTypes';
import NativeAnimatedHelper from '../NativeAnimatedHelper';






const NativeAnimatedAPI = NativeAnimatedHelper.API;

const defaultColor = {r: 0, g: 0, b: 0, a: 1.0};
let _uniqueId = 1;

/* eslint no-bitwise: 0 */
function processColor(
  color,
) {
  if (color === undefined || color === null) {
    return null;
  }

  if (isRgbaValue(color)) {
    // $FlowIgnore[incompatible-cast] - Type is verified above
    return (color);
  }

  let normalizedColor = normalizeColor(
    // $FlowIgnore[incompatible-cast] - Type is verified above
    (color),
  );
  if (normalizedColor === undefined || normalizedColor === null) {
    return null;
  }

  if (typeof normalizedColor === 'object') {
    const processedColorObj =
      processColorObject(normalizedColor);
    if (processedColorObj != null) {
      return processedColorObj;
    }
  } else if (typeof normalizedColor === 'number') {
    const r = (normalizedColor & 0xff000000) >>> 24;
    const g = (normalizedColor & 0x00ff0000) >>> 16;
    const b = (normalizedColor & 0x0000ff00) >>> 8;
    const a = (normalizedColor & 0x000000ff) / 255;

    return {r, g, b, a};
  }

  return null;
}

function isRgbaValue(value) {
  return (
    value &&
    typeof value.r === 'number' &&
    typeof value.g === 'number' &&
    typeof value.b === 'number' &&
    typeof value.a === 'number'
  );
}

function isRgbaAnimatedValue(value) {
  return (
    value &&
    value.r instanceof AnimatedValue &&
    value.g instanceof AnimatedValue &&
    value.b instanceof AnimatedValue &&
    value.a instanceof AnimatedValue
  );
}

export default class AnimatedColor extends AnimatedWithChildren {
  r;
  g;
  b;
  a;
  nativeColor;
  _listeners = {};

  constructor(
    valueIn,
    config,
  ) {
    super();
    let value =
      valueIn ?? defaultColor;
    if (isRgbaAnimatedValue(value)) {
      // $FlowIgnore[incompatible-cast] - Type is verified above
      const rgbaAnimatedValue = (value);
      this.r = rgbaAnimatedValue.r;
      this.g = rgbaAnimatedValue.g;
      this.b = rgbaAnimatedValue.b;
      this.a = rgbaAnimatedValue.a;
    } else {
      const processedColor =
        // $FlowIgnore[incompatible-cast] - Type is verified above
        processColor((value)) ?? defaultColor;
      let initColor = defaultColor;
      if (isRgbaValue(processedColor)) {
        // $FlowIgnore[incompatible-cast] - Type is verified above
        initColor = (processedColor);
      } else {
        // $FlowIgnore[incompatible-cast] - Type is verified above
        this.nativeColor = (processedColor);
      }

      this.r = new AnimatedValue(initColor.r);
      this.g = new AnimatedValue(initColor.g);
      this.b = new AnimatedValue(initColor.b);
      this.a = new AnimatedValue(initColor.a);
    }
    if (this.nativeColor || (config && config.useNativeDriver)) {
      this.__makeNative();
    }
  }

  /**
   * Directly set the value. This will stop any animations running on the value
   * and update all the bound properties.
   */
  setValue(value) {
    let shouldUpdateNodeConfig = false;
    if (this.__isNative) {
      const nativeTag = this.__getNativeTag();
      NativeAnimatedAPI.setWaitingForIdentifier(nativeTag.toString());
    }

    const processedColor =
      processColor(value) ?? defaultColor;
    if (isRgbaValue(processedColor)) {
      // $FlowIgnore[incompatible-type] - Type is verified above
      const rgbaValue = processedColor;
      this.r.setValue(rgbaValue.r);
      this.g.setValue(rgbaValue.g);
      this.b.setValue(rgbaValue.b);
      this.a.setValue(rgbaValue.a);
      if (this.nativeColor != null) {
        this.nativeColor = null;
        shouldUpdateNodeConfig = true;
      }
    } else {
      // $FlowIgnore[incompatible-type] - Type is verified above
      const nativeColor = processedColor;
      if (this.nativeColor !== nativeColor) {
        this.nativeColor = nativeColor;
        shouldUpdateNodeConfig = true;
      }
    }

    if (this.__isNative) {
      const nativeTag = this.__getNativeTag();
      if (shouldUpdateNodeConfig) {
        NativeAnimatedAPI.updateAnimatedNodeConfig(
          nativeTag,
          this.__getNativeConfig(),
        );
      }
      NativeAnimatedAPI.unsetWaitingForIdentifier(nativeTag.toString());
    }
  }

  /**
   * Sets an offset that is applied on top of whatever value is set, whether
   * via `setValue`, an animation, or `Animated.event`. Useful for compensating
   * things like the start of a pan gesture.
   */
  setOffset(offset) {
    this.r.setOffset(offset.r);
    this.g.setOffset(offset.g);
    this.b.setOffset(offset.b);
    this.a.setOffset(offset.a);
  }

  /**
   * Merges the offset value into the base value and resets the offset to zero.
   * The final output of the value is unchanged.
   */
  flattenOffset() {
    this.r.flattenOffset();
    this.g.flattenOffset();
    this.b.flattenOffset();
    this.a.flattenOffset();
  }

  /**
   * Sets the offset value to the base value, and resets the base value to
   * zero. The final output of the value is unchanged.
   */
  extractOffset() {
    this.r.extractOffset();
    this.g.extractOffset();
    this.b.extractOffset();
    this.a.extractOffset();
  }

  /**
   * Adds an asynchronous listener to the value so you can observe updates from
   * animations.  This is useful because there is no way to synchronously read
   * the value because it might be driven natively.
   *
   * Returns a string that serves as an identifier for the listener.
   */
  addListener(callback) {
    const id = String(_uniqueId++);
    const jointCallback = ({value: number}) => {
      callback(this.__getValue());
    };
    this._listeners[id] = {
      r: this.r.addListener(jointCallback),
      g: this.g.addListener(jointCallback),
      b: this.b.addListener(jointCallback),
      a: this.a.addListener(jointCallback),
    };
    return id;
  }

  /**
   * Unregister a listener. The `id` param shall match the identifier
   * previously returned by `addListener()`.
   */
  removeListener(id) {
    this.r.removeListener(this._listeners[id].r);
    this.g.removeListener(this._listeners[id].g);
    this.b.removeListener(this._listeners[id].b);
    this.a.removeListener(this._listeners[id].a);
    delete this._listeners[id];
  }

  /**
   * Remove all registered listeners.
   */
  removeAllListeners() {
    this.r.removeAllListeners();
    this.g.removeAllListeners();
    this.b.removeAllListeners();
    this.a.removeAllListeners();
    this._listeners = {};
  }

  /**
   * Stops any running animation or tracking. `callback` is invoked with the
   * final value after stopping the animation, which is useful for updating
   * state to match the animation position with layout.
   */
  stopAnimation(callback) {
    this.r.stopAnimation();
    this.g.stopAnimation();
    this.b.stopAnimation();
    this.a.stopAnimation();
    callback && callback(this.__getValue());
  }

  /**
   * Stops any animation and resets the value to its original.
   */
  resetAnimation(callback) {
    this.r.resetAnimation();
    this.g.resetAnimation();
    this.b.resetAnimation();
    this.a.resetAnimation();
    callback && callback(this.__getValue());
  }

  __getValue() {
    if (this.nativeColor != null) {
      return this.nativeColor;
    } else {
      return `rgba(${this.r.__getValue()}, ${this.g.__getValue()}, ${this.b.__getValue()}, ${this.a.__getValue()})`;
    }
  }

  __attach() {
    this.r.__addChild(this);
    this.g.__addChild(this);
    this.b.__addChild(this);
    this.a.__addChild(this);
    super.__attach();
  }

  __detach() {
    this.r.__removeChild(this);
    this.g.__removeChild(this);
    this.b.__removeChild(this);
    this.a.__removeChild(this);
    super.__detach();
  }

  __makeNative(platformConfig) {
    this.r.__makeNative(platformConfig);
    this.g.__makeNative(platformConfig);
    this.b.__makeNative(platformConfig);
    this.a.__makeNative(platformConfig);
    super.__makeNative(platformConfig);
  }

  __getNativeConfig() {
    return {
      type: 'color',
      r: this.r.__getNativeTag(),
      g: this.g.__getNativeTag(),
      b: this.b.__getNativeTag(),
      a: this.a.__getNativeTag(),
      nativeColor: this.nativeColor,
    };
  }
}
