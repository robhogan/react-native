/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *  strict-local
 * @format
 */

'use strict';



/**
 * React Native's layout system is based on Flexbox and is powered both
 * on iOS and Android by an open source project called `Yoga`:
 * https://github.com/facebook/yoga
 *
 * The implementation in Yoga is slightly different from what the
 * Flexbox spec defines - for example, we chose more sensible default
 * values. Since our layout docs are generated from the comments in this
 * file, please keep a brief comment describing each prop type.
 *
 * These properties are a subset of our styles that are consumed by the layout
 * algorithm and affect the positioning and sizing of views.
 */

/**
 * These props can be used to dynamically generate shadows on views, images, text, etc.
 *
 * Because they are dynamically generated, they may cause performance regressions. Static
 * shadow image asset may be a better way to go for optimal performance.
 *
 * Shadow-related properties are not fully supported on Android.
 * To add a drop shadow to a view use the [`elevation` property](docs/viewstyleproptypes.html#elevation) (Android 5.0+).
 * To customize the color use the [`shadowColor` property](docs/shadow-props.html#shadowColor) (Android 9.0+).
 */

















