/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *  strict-local
 * @format
 */


import {PressabilityDebugView} from '../../Pressability/PressabilityDebug';
import usePressability from '../../Pressability/usePressability';
import {} from '../../StyleSheet/Rect';
import View from '../View/View';
import useAndroidRippleForView, {
} from './useAndroidRippleForView';
import * as React from 'react';
import {useImperativeHandle, useMemo, useRef, useState} from 'react';




/**
 * Component used to build display components that should respond to whether the
 * component is currently pressed or not.
 */
/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */
function Pressable(props, forwardedRef) {
  const {
    accessible,
    accessibilityState,
    'aria-live': ariaLive,
    android_disableSound,
    android_ripple,
    'aria-busy': ariaBusy,
    'aria-checked': ariaChecked,
    'aria-disabled': ariaDisabled,
    'aria-expanded': ariaExpanded,
    'aria-label': ariaLabel,
    'aria-selected': ariaSelected,
    cancelable,
    children,
    delayHoverIn,
    delayHoverOut,
    delayLongPress,
    disabled,
    focusable,
    hitSlop,
    onHoverIn,
    onHoverOut,
    onLongPress,
    onPress,
    onPressIn,
    onPressOut,
    pressRetentionOffset,
    style,
    testOnly_pressed,
    unstable_pressDelay,
    ...restProps
  } = props;

  const viewRef = useRef(null);
  useImperativeHandle(forwardedRef, () => viewRef.current);

  const android_rippleConfig = useAndroidRippleForView(android_ripple, viewRef);

  const [pressed, setPressed] = usePressState(testOnly_pressed === true);

  let _accessibilityState = {
    busy: ariaBusy ?? accessibilityState?.busy,
    checked: ariaChecked ?? accessibilityState?.checked,
    disabled: ariaDisabled ?? accessibilityState?.disabled,
    expanded: ariaExpanded ?? accessibilityState?.expanded,
    selected: ariaSelected ?? accessibilityState?.selected,
  };

  _accessibilityState =
    disabled != null ? {..._accessibilityState, disabled} : _accessibilityState;

  const accessibilityValue = {
    max: props['aria-valuemax'] ?? props.accessibilityValue?.max,
    min: props['aria-valuemin'] ?? props.accessibilityValue?.min,
    now: props['aria-valuenow'] ?? props.accessibilityValue?.now,
    text: props['aria-valuetext'] ?? props.accessibilityValue?.text,
  };

  const accessibilityLiveRegion =
    ariaLive === 'off' ? 'none' : ariaLive ?? props.accessibilityLiveRegion;

  const accessibilityLabel = ariaLabel ?? props.accessibilityLabel;
  const restPropsWithDefaults = {
    ...restProps,
    ...android_rippleConfig?.viewProps,
    accessible: accessible !== false,
    accessibilityViewIsModal:
      restProps['aria-modal'] ?? restProps.accessibilityViewIsModal,
    accessibilityLiveRegion,
    accessibilityLabel,
    accessibilityState: _accessibilityState,
    focusable: focusable !== false,
    accessibilityValue,
    hitSlop,
  };

  const config = useMemo(
    () => ({
      cancelable,
      disabled,
      hitSlop,
      pressRectOffset: pressRetentionOffset,
      android_disableSound,
      delayHoverIn,
      delayHoverOut,
      delayLongPress,
      delayPressIn: unstable_pressDelay,
      onHoverIn,
      onHoverOut,
      onLongPress,
      onPress,
      onPressIn(event) {
        if (android_rippleConfig != null) {
          android_rippleConfig.onPressIn(event);
        }
        setPressed(true);
        if (onPressIn != null) {
          onPressIn(event);
        }
      },
      onPressMove: android_rippleConfig?.onPressMove,
      onPressOut(event) {
        if (android_rippleConfig != null) {
          android_rippleConfig.onPressOut(event);
        }
        setPressed(false);
        if (onPressOut != null) {
          onPressOut(event);
        }
      },
    }),
    [
      android_disableSound,
      android_rippleConfig,
      cancelable,
      delayHoverIn,
      delayHoverOut,
      delayLongPress,
      disabled,
      hitSlop,
      onHoverIn,
      onHoverOut,
      onLongPress,
      onPress,
      onPressIn,
      onPressOut,
      pressRetentionOffset,
      setPressed,
      unstable_pressDelay,
    ],
  );
  const eventHandlers = usePressability(config);

  return (
    <View
      {...restPropsWithDefaults}
      {...eventHandlers}
      ref={viewRef}
      style={typeof style === 'function' ? style({pressed}) : style}
      collapsable={false}>
      {typeof children === 'function' ? children({pressed}) : children}
      {__DEV__ ? <PressabilityDebugView color="red" hitSlop={hitSlop} /> : null}
    </View>
  );
}

function usePressState(forcePressed) {
  const [pressed, setPressed] = useState(false);
  return [pressed || forcePressed, setPressed];
}

const MemoedPressable = React.memo(React.forwardRef(Pressable));
MemoedPressable.displayName = 'Pressable';

export default (MemoedPressable);
