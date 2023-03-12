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
import AnimatedImplementation from './AnimatedImplementation';
import AnimatedMock from './AnimatedMock';

const Animated = ((Platform.isTesting
  ? AnimatedMock
  : AnimatedImplementation));

export default {
  get FlatList() {
    return require('./components/AnimatedFlatList').default;
  },
  get Image() {
    return require('./components/AnimatedImage').default;
  },
  get ScrollView() {
    return require('./components/AnimatedScrollView').default;
  },
  get SectionList() {
    return require('./components/AnimatedSectionList').default;
  },
  get Text() {
    return require('./components/AnimatedText').default;
  },
  get View() {
    return require('./components/AnimatedView').default;
  },
  ...Animated,
};
