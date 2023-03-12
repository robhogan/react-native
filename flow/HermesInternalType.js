/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *  strict
 * @format
 */

// Declarations for functionality exposed by the Hermes VM.
//
// For backwards-compatibility, code that uses such functionality must also
// check explicitly at run-time whether the object(s) and method(s) exist, and
// fail safely if not.

/**
 * HermesInternalType is an object containing functions used to interact with
 * the VM in a way that is not standardized by the JS spec.
 * There are limited guarantees about these functions, and they should not be
 * widely used. Consult with the Hermes team before using any of these.
 * There may be other visible properties on this object; however, those are
 * only exposed for testing purposes: do not use them.
 */
