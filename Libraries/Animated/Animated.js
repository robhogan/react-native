/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */

import Platform from '../Utilities/Platform';

import * as AnimatedMock from './AnimatedMock';
import * as AnimatedImplementation from './AnimatedImplementation';

const Animated = ((Platform.isTesting
  ? AnimatedMock
  : AnimatedImplementation));

module.exports = {
  get FlatList() {
    return require('./components/AnimatedFlatList');
  },
  get Image() {
    return require('./components/AnimatedImage');
  },
  get ScrollView() {
    return require('./components/AnimatedScrollView');
  },
  get SectionList() {
    return require('./components/AnimatedSectionList');
  },
  get Text() {
    return require('./components/AnimatedText');
  },
  get View() {
    return require('./components/AnimatedView');
  },
  ...Animated,
};
