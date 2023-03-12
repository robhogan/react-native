/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 */

const {dispatchCommand} = require('../ReactNative/RendererProxy');


function codegenNativeCommands(options) {
  const commandObj = {};

  options.supportedCommands.forEach(command => {
    commandObj[command] = (ref, ...args) => {
      dispatchCommand(ref, command, args);
    };
  });

  return ((commandObj));
}

export default codegenNativeCommands;
