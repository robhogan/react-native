/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *  strict-local
 * @format
 */


import RefreshControl from '../../Components/RefreshControl/RefreshControl';
import ScrollView from '../../Components/ScrollView/ScrollView';
import flattenStyle from '../../StyleSheet/flattenStyle';
import splitLayoutProps from '../../StyleSheet/splitLayoutProps';
import StyleSheet from '../../StyleSheet/StyleSheet';
import Platform from '../../Utilities/Platform';
import useMergeRefs from '../../Utilities/useMergeRefs';
import createAnimatedComponent from '../createAnimatedComponent';
import useAnimatedProps from '../useAnimatedProps';
import * as React from 'react';
import {useMemo} from 'react';


/**
 * @see https://github.com/facebook/react-native/commit/b8c8562
 */
const AnimatedScrollView =
  React.forwardRef((props, forwardedRef) => {
    // (Android only) When a ScrollView has a RefreshControl and
    // any `style` property set with an Animated.Value, the CSS
    // gets incorrectly applied twice. This is because ScrollView
    // swaps the parent/child relationship of itself and the
    // RefreshControl component (see ScrollView.js for more details).
    if (
      Platform.OS === 'android' &&
      props.refreshControl != null &&
      props.style != null
    ) {
      return (
        <AnimatedScrollViewWithInvertedRefreshControl
          scrollEventThrottle={0.0001}
          {...props}
          ref={forwardedRef}
          refreshControl={props.refreshControl}
        />
      );
    } else {
      return (
        <AnimatedScrollViewWithoutInvertedRefreshControl
          scrollEventThrottle={0.0001}
          {...props}
          ref={forwardedRef}
        />
      );
    }
  });

const AnimatedScrollViewWithInvertedRefreshControl = React.forwardRef(
  (
    props,
    forwardedRef,
  ) => {
    // Split `props` into the animate-able props for the parent (RefreshControl)
    // and child (ScrollView).
    const {intermediatePropsForRefreshControl, intermediatePropsForScrollView} =
      useMemo(() => {
        const {outer, inner} = splitLayoutProps(flattenStyle(props.style));
        return {
          intermediatePropsForRefreshControl: {style: outer},
          intermediatePropsForScrollView: {...props, style: inner},
        };
      }, [props]);

    // Handle animated props on `refreshControl`.
    const [refreshControlAnimatedProps, refreshControlRef] = useAnimatedProps(intermediatePropsForRefreshControl);
    // NOTE: Assumes that refreshControl.ref` and `refreshControl.style` can be
    // safely clobbered.
    const refreshControl =
      React.cloneElement(props.refreshControl, {
        ...refreshControlAnimatedProps,
        ref: refreshControlRef,
      });

    // Handle animated props on `NativeDirectionalScrollView`.
    const [scrollViewAnimatedProps, scrollViewRef] = useAnimatedProps(intermediatePropsForScrollView);
    const ref = useMergeRefs(scrollViewRef, forwardedRef);

    return (
      // $FlowFixMe[incompatible-use] Investigate useAnimatedProps return value
      <ScrollView
        {...scrollViewAnimatedProps}
        ref={ref}
        refreshControl={refreshControl}
        // Because `refreshControl` is a clone of `props.refreshControl` with
        // `refreshControlAnimatedProps` added, we need to pass ScrollView.js
        // the combined styles since it also splits the outer/inner styles for
        // its parent/child, respectively. Without this, the refreshControl
        // styles would be ignored.
        style={StyleSheet.compose(
          scrollViewAnimatedProps.style,
          refreshControlAnimatedProps.style,
        )}
      />
    );
  },
);

const AnimatedScrollViewWithoutInvertedRefreshControl =
  createAnimatedComponent(ScrollView);

export default AnimatedScrollView;
