/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *  strict-local
 * @format
 */


import View from '../../Components/View/View';
import Pressability, {
} from '../../Pressability/Pressability';
import {PressabilityDebugView} from '../../Pressability/PressabilityDebug';
import * as React from 'react';



const PASSTHROUGH_PROPS = [
  'accessibilityActions',
  'accessibilityElementsHidden',
  'accessibilityHint',
  'accessibilityLanguage',
  'accessibilityIgnoresInvertColors',
  'accessibilityLabel',
  'accessibilityLiveRegion',
  'accessibilityRole',
  'accessibilityValue',
  'aria-valuemax',
  'aria-valuemin',
  'aria-valuenow',
  'aria-valuetext',
  'accessibilityViewIsModal',
  'aria-modal',
  'hitSlop',
  'importantForAccessibility',
  'nativeID',
  'onAccessibilityAction',
  'onBlur',
  'onFocus',
  'onLayout',
  'testID',
];

class TouchableWithoutFeedback extends React.Component {
  state = {
    pressability: new Pressability(createPressabilityConfig(this.props)),
  };

  render() {
    const element = React.Children.only(this.props.children);
    const children = [element.props.children];
    const ariaLive = this.props['aria-live'];

    if (__DEV__) {
      if (element.type === View) {
        children.push(
          <PressabilityDebugView color="red" hitSlop={this.props.hitSlop} />,
        );
      }
    }

    let _accessibilityState = {
      busy: this.props['aria-busy'] ?? this.props.accessibilityState?.busy,
      checked:
        this.props['aria-checked'] ?? this.props.accessibilityState?.checked,
      disabled:
        this.props['aria-disabled'] ?? this.props.accessibilityState?.disabled,
      expanded:
        this.props['aria-expanded'] ?? this.props.accessibilityState?.expanded,
      selected:
        this.props['aria-selected'] ?? this.props.accessibilityState?.selected,
    };

    // BACKWARD-COMPATIBILITY: Focus and blur events were never supported before
    // adopting `Pressability`, so preserve that behavior.
    const {onBlur, onFocus, ...eventHandlersWithoutBlurAndFocus} =
      this.state.pressability.getEventHandlers();

    const elementProps = {
      ...eventHandlersWithoutBlurAndFocus,
      accessible: this.props.accessible !== false,
      accessibilityState:
        this.props.disabled != null
          ? {
              ..._accessibilityState,
              disabled: this.props.disabled,
            }
          : _accessibilityState,
      focusable:
        this.props.focusable !== false && this.props.onPress !== undefined,

      accessibilityElementsHidden:
        this.props['aria-hidden'] ?? this.props.accessibilityElementsHidden,
      importantForAccessibility:
        this.props['aria-hidden'] === true
          ? 'no-hide-descendants'
          : this.props.importantForAccessibility,
      accessibilityLiveRegion:
        ariaLive === 'off'
          ? 'none'
          : ariaLive ?? this.props.accessibilityLiveRegion,
      nativeID: this.props.id ?? this.props.nativeID,
    };
    for (const prop of PASSTHROUGH_PROPS) {
      if (this.props[prop] !== undefined) {
        elementProps[prop] = this.props[prop];
      }
    }

    return React.cloneElement(element, elementProps, ...children);
  }

  componentDidUpdate() {
    this.state.pressability.configure(createPressabilityConfig(this.props));
  }

  componentWillUnmount() {
    this.state.pressability.reset();
  }
}

function createPressabilityConfig({
  'aria-disabled': ariaDisabled,
  ...props
}) {
  const accessibilityStateDisabled =
    ariaDisabled ?? props.accessibilityState?.disabled;
  return {
    cancelable: !props.rejectResponderTermination,
    disabled:
      props.disabled !== null ? props.disabled : accessibilityStateDisabled,
    hitSlop: props.hitSlop,
    delayLongPress: props.delayLongPress,
    delayPressIn: props.delayPressIn,
    delayPressOut: props.delayPressOut,
    minPressDuration: 0,
    pressRectOffset: props.pressRetentionOffset,
    android_disableSound: props.touchSoundDisabled,
    onBlur: props.onBlur,
    onFocus: props.onFocus,
    onLongPress: props.onLongPress,
    onPress: props.onPress,
    onPressIn: props.onPressIn,
    onPressOut: props.onPressOut,
  };
}

TouchableWithoutFeedback.displayName = 'TouchableWithoutFeedback';

module.exports = TouchableWithoutFeedback;
