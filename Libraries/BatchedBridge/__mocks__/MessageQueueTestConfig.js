/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *  strict-local
 * @format
 */

// These don't actually exist anywhere in the code.

'use strict';


const remoteModulesConfig = [
  [
    'RemoteModule1',
    null,
    ['remoteMethod', 'promiseMethod', 'promiseReturningMethod', 'syncMethod'],
    [2 /* promiseReturningMethod */],
    [3 /* syncMethod */],
  ],
  [
    'RemoteModule2',
    null,
    ['remoteMethod', 'promiseMethod', 'promiseReturningMethod', 'syncMethod'],
    [2 /* promiseReturningMethod */],
    [3 /* syncMethod */],
  ],
];

const MessageQueueTestConfig = {
  remoteModuleConfig: remoteModulesConfig,
};

module.exports = MessageQueueTestConfig;
