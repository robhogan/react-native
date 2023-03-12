/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 */

'use strict';

module.exports = require('../Components/UnimplementedViews/UnimplementedView');


function emptyFunction() {}


let BackHandler = {
  exitApp: emptyFunction,
  addEventListener(_eventName, _handler) {
    return {
      remove: emptyFunction,
    };
  },
  removeEventListener(_eventName, _handler) {},
};

module.exports = BackHandler;
