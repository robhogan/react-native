/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *  strict
 * @format
 */

const FileReaderModule = {
  async readAsText() {
    return '';
  },
  async readAsDataURL() {
    return 'data:text/plain;base64,NDI=';
  },
};

module.exports = FileReaderModule;
