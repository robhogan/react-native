/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 *  strict-local
 */

/* eslint-env jest */

'use strict';

const React = require('react');

function mockModal(BaseComponent) {
  class ModalMock extends BaseComponent {
    render() {
      return (
        <BaseComponent {...this.props}>
          {this.props.visible !== true ? null : this.props.children}
        </BaseComponent>
      );
    }
  }
  return ModalMock;
}

module.exports = (mockModal);
