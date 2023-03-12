/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *  strict-local
 * @format
 * @generate-docs
 */

import Platform from '../../Utilities/Platform';
import * as React from 'react';
import StyleSheet from '../../StyleSheet/StyleSheet';
import useMergeRefs from '../../Utilities/useMergeRefs';

import AndroidSwitchNativeComponent, {
  Commands as AndroidSwitchCommands,
} from './AndroidSwitchNativeComponent';
import SwitchNativeComponent, {
  Commands as SwitchCommands,
} from './SwitchNativeComponent';



const returnsFalse = () => false;
const returnsTrue = () => true;

/**
  Renders a boolean input.

  This is a controlled component that requires an `onValueChange`
  callback that updates the `value` prop in order for the component to
  reflect user actions. If the `value` prop is not updated, the
  component will continue to render the supplied `value` prop instead of
  the expected result of any user actions.

  ```SnackPlayer name=Switch
  import React, { useState } from "react";
  import { View, Switch, StyleSheet } from "react-native";

  const App = () => {
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    return (
      <View style={styles.container}>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center"
    }
  });

  export default App;
  ```
 */

const SwitchWithForwardedRef = React.forwardRef(function Switch(props, forwardedRef) {
  const {
    disabled,
    ios_backgroundColor,
    onChange,
    onValueChange,
    style,
    thumbColor,
    trackColor,
    value,
    ...restProps
  } = props;
  const trackColorForFalse = trackColor?.false;
  const trackColorForTrue = trackColor?.true;

  const nativeSwitchRef = React.useRef(null);

  const ref = useMergeRefs(nativeSwitchRef, forwardedRef);

  const [native, setNative] = React.useState({value: null});

  const handleChange = (event) => {
    onChange?.(event);
    onValueChange?.(event.nativeEvent.value);
    setNative({value: event.nativeEvent.value});
  };

  React.useLayoutEffect(() => {
    // This is necessary in case native updates the switch and JS decides
    // that the update should be ignored and we should stick with the value
    // that we have in JS.
    const jsValue = value === true;
    const shouldUpdateNativeSwitch =
      native.value != null && native.value !== jsValue;
    if (
      shouldUpdateNativeSwitch &&
      nativeSwitchRef.current?.setNativeProps != null
    ) {
      if (Platform.OS === 'android') {
        AndroidSwitchCommands.setNativeValue(nativeSwitchRef.current, jsValue);
      } else {
        SwitchCommands.setValue(nativeSwitchRef.current, jsValue);
      }
    }
  }, [value, native]);

  if (Platform.OS === 'android') {
    const {accessibilityState} = restProps;
    const _disabled =
      disabled != null ? disabled : accessibilityState?.disabled;

    const _accessibilityState =
      _disabled !== accessibilityState?.disabled
        ? {...accessibilityState, disabled: _disabled}
        : accessibilityState;

    const platformProps = {
      accessibilityState: _accessibilityState,
      enabled: _disabled !== true,
      on: value === true,
      style,
      thumbTintColor: thumbColor,
      trackColorForFalse: trackColorForFalse,
      trackColorForTrue: trackColorForTrue,
      trackTintColor: value === true ? trackColorForTrue : trackColorForFalse,
    };

    return (
      <AndroidSwitchNativeComponent
        {...restProps}
        {...platformProps}
        accessibilityRole={props.accessibilityRole ?? 'switch'}
        onChange={handleChange}
        onResponderTerminationRequest={returnsFalse}
        onStartShouldSetResponder={returnsTrue}
        ref={ref}
      />
    );
  } else {
    const platformProps = {
      disabled,
      onTintColor: trackColorForTrue,
      style: StyleSheet.compose(
        {height: 31, width: 51},
        StyleSheet.compose(
          style,
          ios_backgroundColor == null
            ? null
            : {
                backgroundColor: ios_backgroundColor,
                borderRadius: 16,
              },
        ),
      ),
      thumbTintColor: thumbColor,
      tintColor: trackColorForFalse,
      value: value === true,
    };

    return (
      <SwitchNativeComponent
        {...restProps}
        {...platformProps}
        accessibilityRole={props.accessibilityRole ?? 'switch'}
        onChange={handleChange}
        onResponderTerminationRequest={returnsFalse}
        onStartShouldSetResponder={returnsTrue}
        ref={ref}
      />
    );
  }
});

export default SwitchWithForwardedRef;
