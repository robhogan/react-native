/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 *  strict-local
 */

// https://dom.spec.whatwg.org/#dictdef-eventinit

/**
 * This is a copy of the Event interface defined in Flow:
 * https://github.com/facebook/flow/blob/741104e69c43057ebd32804dd6bcc1b5e97548ea/lib/dom.js
 * which is itself a faithful interface of the W3 spec:
 * https://dom.spec.whatwg.org/#interface-event
 *
 * Since Flow assumes that Event is provided and is on the global object,
 * we must provide an implementation of Event for CustomEvent (and future
 * alignment of React Native's event system with the W3 spec).
 */

class EventPolyfill {
  type;
  bubbles;
  cancelable;
  composed;
  // Non-standard. See `composed` instead.
  scoped;
  isTrusted;
  defaultPrevented;
  timeStamp;

  // https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase
  NONE;
  AT_TARGET;
  BUBBLING_PHASE;
  CAPTURING_PHASE;

  eventPhase;

  currentTarget; // TODO: nullable
  target; // TODO: nullable
  /** @deprecated */
  srcElement; // TODO: nullable

  // React Native-specific: proxy data to a SyntheticEvent when
  // certain methods are called.
  // SyntheticEvent will also have a reference to this instance -
  // it is circular - and both classes use this reference to keep
  // data with the other in sync.
  _syntheticEvent;

  constructor(type, eventInitDict) {
    this.type = type;
    this.bubbles = !!(eventInitDict?.bubbles || false);
    this.cancelable = !!(eventInitDict?.cancelable || false);
    this.composed = !!(eventInitDict?.composed || false);
    this.scoped = !!(eventInitDict?.scoped || false);

    // TODO: somehow guarantee that only "private" instantiations of Event
    // can set this to true
    this.isTrusted = false;

    // TODO: in the future we'll want to make sure this has the same
    // time-basis as events originating from native
    this.timeStamp = Date.now();

    this.defaultPrevented = false;

    // https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase
    this.NONE = 0;
    this.AT_TARGET = 1;
    this.BUBBLING_PHASE = 2;
    this.CAPTURING_PHASE = 3;
    this.eventPhase = this.NONE;

    // $FlowFixMe
    this.currentTarget = null;
    // $FlowFixMe
    this.target = null;
    // $FlowFixMe
    this.srcElement = null;
  }

  composedPath() {
    throw new Error('TODO: not yet implemented');
  }

  preventDefault() {
    this.defaultPrevented = true;

    if (this._syntheticEvent != null) {
      // $FlowFixMe
      this._syntheticEvent.preventDefault();
    }
  }

  initEvent(type, bubbles, cancelable) {
    throw new Error(
      'TODO: not yet implemented. This method is also deprecated.',
    );
  }

  stopImmediatePropagation() {
    throw new Error('TODO: not yet implemented');
  }

  stopPropagation() {
    if (this._syntheticEvent != null) {
      // $FlowFixMe
      this._syntheticEvent.stopPropagation();
    }
  }

  setSyntheticEvent(value) {
    this._syntheticEvent = value;
  }
}

// Assertion magic for polyfill follows.

/*::
// This can be a strict mode error at runtime so put it in a Flow comment.
(checkEvent);
*/

global.Event = EventPolyfill;

export default EventPolyfill;
