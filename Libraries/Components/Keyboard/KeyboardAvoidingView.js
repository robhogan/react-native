/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 *  strict-local
 */

import Keyboard from './Keyboard';
import LayoutAnimation from '../../LayoutAnimation/LayoutAnimation';
import Platform from '../../Utilities/Platform';
import * as React from 'react';
import StyleSheet from '../../StyleSheet/StyleSheet';
import View from '../View/View';

import {} from '../../vendor/emitter/EventEmitter';
import AccessibilityInfo from '../AccessibilityInfo/AccessibilityInfo';



/**
 * View that moves out of the way when the keyboard appears by automatically
 * adjusting its height, position, or bottom padding.
 */
class KeyboardAvoidingView extends React.Component {
  _frame = null;
  _keyboardEvent = null;
  _subscriptions = [];
  viewRef;
  _initialFrameHeight = 0;

  constructor(props) {
    super(props);
    this.state = {bottom: 0};
    this.viewRef = React.createRef();
  }

  async _relativeKeyboardHeight(
    keyboardFrame,
  ) {
    const frame = this._frame;
    if (!frame || !keyboardFrame) {
      return 0;
    }

    // On iOS when Prefer Cross-Fade Transitions is enabled, the keyboard position
    // & height is reported differently (0 instead of Y position value matching height of frame)
    if (
      Platform.OS === 'ios' &&
      keyboardFrame.screenY === 0 &&
      (await AccessibilityInfo.prefersCrossFadeTransitions())
    ) {
      return 0;
    }

    const keyboardY =
      keyboardFrame.screenY - (this.props.keyboardVerticalOffset ?? 0);

    // Calculate the displacement needed for the view such that it
    // no longer overlaps with the keyboard
    return Math.max(frame.y + frame.height - keyboardY, 0);
  }

  _onKeyboardChange = (event) => {
    this._keyboardEvent = event;
    this._updateBottomIfNecessary();
  };

  _onLayout = async (event) => {
    const wasFrameNull = this._frame == null;
    this._frame = event.nativeEvent.layout;
    if (!this._initialFrameHeight) {
      // save the initial frame height, before the keyboard is visible
      this._initialFrameHeight = this._frame.height;
    }

    if (wasFrameNull) {
      await this._updateBottomIfNecessary();
    }

    if (this.props.onLayout) {
      this.props.onLayout(event);
    }
  };

  _updateBottomIfNecessary = async () => {
    if (this._keyboardEvent == null) {
      this.setState({bottom: 0});
      return;
    }

    const {duration, easing, endCoordinates} = this._keyboardEvent;
    const height = await this._relativeKeyboardHeight(endCoordinates);

    if (this.state.bottom === height) {
      return;
    }

    if (duration && easing) {
      LayoutAnimation.configureNext({
        // We have to pass the duration equal to minimal accepted duration defined here: RCTLayoutAnimation.m
        duration: duration > 10 ? duration : 10,
        update: {
          duration: duration > 10 ? duration : 10,
          type: LayoutAnimation.Types[easing] || 'keyboard',
        },
      });
    }
    this.setState({bottom: height});
  };

  componentDidMount() {
    if (Platform.OS === 'ios') {
      this._subscriptions = [
        Keyboard.addListener('keyboardWillChangeFrame', this._onKeyboardChange),
      ];
    } else {
      this._subscriptions = [
        Keyboard.addListener('keyboardDidHide', this._onKeyboardChange),
        Keyboard.addListener('keyboardDidShow', this._onKeyboardChange),
      ];
    }
  }

  componentWillUnmount() {
    this._subscriptions.forEach(subscription => {
      subscription.remove();
    });
  }

  render() {
    const {
      behavior,
      children,
      contentContainerStyle,
      enabled = true,
      // eslint-disable-next-line no-unused-vars
      keyboardVerticalOffset = 0,
      style,
      onLayout,
      ...props
    } = this.props;
    const bottomHeight = enabled === true ? this.state.bottom : 0;
    switch (behavior) {
      case 'height':
        let heightStyle;
        if (this._frame != null && this.state.bottom > 0) {
          // Note that we only apply a height change when there is keyboard present,
          // i.e. this.state.bottom is greater than 0. If we remove that condition,
          // this.frame.height will never go back to its original value.
          // When height changes, we need to disable flex.
          heightStyle = {
            height: this._initialFrameHeight - bottomHeight,
            flex: 0,
          };
        }
        return (
          <View
            ref={this.viewRef}
            style={StyleSheet.compose(style, heightStyle)}
            onLayout={this._onLayout}
            {...props}>
            {children}
          </View>
        );

      case 'position':
        return (
          <View
            ref={this.viewRef}
            style={style}
            onLayout={this._onLayout}
            {...props}>
            <View
              style={StyleSheet.compose(contentContainerStyle, {
                bottom: bottomHeight,
              })}>
              {children}
            </View>
          </View>
        );

      case 'padding':
        return (
          <View
            ref={this.viewRef}
            style={StyleSheet.compose(style, {paddingBottom: bottomHeight})}
            onLayout={this._onLayout}
            {...props}>
            {children}
          </View>
        );

      default:
        return (
          <View
            ref={this.viewRef}
            onLayout={this._onLayout}
            style={style}
            {...props}>
            {children}
          </View>
        );
    }
  }
}

export default KeyboardAvoidingView;
