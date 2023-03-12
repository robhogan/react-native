/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *  strict-local
 * @format
 */


export default function splitLayoutProps(props) {
  let outer = null;
  let inner = null;

  if (props != null) {
    // $FlowIgnore[incompatible-exact] Will contain a subset of keys from `props`.
    outer = {};
    // $FlowIgnore[incompatible-exact] Will contain a subset of keys from `props`.
    inner = {};

    for (const prop of Object.keys(props)) {
      switch (prop) {
        case 'margin':
        case 'marginHorizontal':
        case 'marginVertical':
        case 'marginBottom':
        case 'marginTop':
        case 'marginLeft':
        case 'marginRight':
        case 'flex':
        case 'flexGrow':
        case 'flexShrink':
        case 'flexBasis':
        case 'alignSelf':
        case 'height':
        case 'minHeight':
        case 'maxHeight':
        case 'width':
        case 'minWidth':
        case 'maxWidth':
        case 'position':
        case 'left':
        case 'right':
        case 'bottom':
        case 'top':
        case 'transform':
          // $FlowFixMe[cannot-write]
          // $FlowFixMe[incompatible-use]
          outer[prop] = props[prop];
          break;
        default:
          // $FlowFixMe[cannot-write]
          // $FlowFixMe[incompatible-use]
          inner[prop] = props[prop];
          break;
      }
    }
  }

  return {outer, inner};
}
