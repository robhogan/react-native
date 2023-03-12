/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @emails oncall+react_native
 * 
 */

import * as React from 'react';
import TestRenderer from 'react-test-renderer';
import ShallowRenderer from 'react-shallow-renderer';

const renderer = new ShallowRenderer();

export const shallow = (Component) => {
  const Wrapper = () => Component;

  return renderer.render(<Wrapper />);
};

export const shallowRender = (Component) => {
  return renderer.render(Component);
};

export const create = (Component) => {
  return TestRenderer.create(Component);
};
