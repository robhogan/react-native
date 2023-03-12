/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *  strict-local
 * @format
 */

import EventEmitter from '../vendor/emitter/EventEmitter';



const RawEventEmitter =
  new EventEmitter();

// See the React renderer / react repo for how this is used.
// Raw events are emitted here when they are received in JS
// and before any event Plugins process them or before components
// have a chance to respond to them. This allows you to implement
// app-specific perf monitoring, which is unimplemented by default,
// making this entire RawEventEmitter do nothing by default until
// *you* add listeners for your own app.
// Besides perf monitoring and maybe debugging, this RawEventEmitter
// should not be used.
export default RawEventEmitter;
