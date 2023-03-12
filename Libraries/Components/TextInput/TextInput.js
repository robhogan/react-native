/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *  strict-local
 * @format
 */


import usePressability from '../../Pressability/usePressability';
import flattenStyle from '../../StyleSheet/flattenStyle';
import StyleSheet, {
} from '../../StyleSheet/StyleSheet';
import Text from '../../Text/Text';
import TextAncestor from '../../Text/TextAncestor';
import Platform from '../../Utilities/Platform';
import setAndForwardRef from '../../Utilities/setAndForwardRef';
import TextInputState from './TextInputState';
import invariant from 'invariant';
import nullthrows from 'nullthrows';
import * as React from 'react';

const {useLayoutEffect, useRef, useState} = React;


let AndroidTextInput;
let AndroidTextInputCommands;
let RCTSinglelineTextInputView;
let RCTSinglelineTextInputNativeCommands;
let RCTMultilineTextInputView;
let RCTMultilineTextInputNativeCommands;

if (Platform.OS === 'android') {
  AndroidTextInput = require('./AndroidTextInputNativeComponent').default;
  AndroidTextInputCommands =
    require('./AndroidTextInputNativeComponent').Commands;
} else if (Platform.OS === 'ios') {
  RCTSinglelineTextInputView =
    require('./RCTSingelineTextInputNativeComponent').default;
  RCTSinglelineTextInputNativeCommands =
    require('./RCTSingelineTextInputNativeComponent').Commands;
  RCTMultilineTextInputView =
    require('./RCTMultilineTextInputNativeComponent').default;
  RCTMultilineTextInputNativeCommands =
    require('./RCTMultilineTextInputNativeComponent').Commands;
}























const emptyFunctionThatReturnsTrue = () => true;

/**
 * A foundational component for inputting text into the app via a
 * keyboard. Props provide configurability for several features, such as
 * auto-correction, auto-capitalization, placeholder text, and different keyboard
 * types, such as a numeric keypad.
 *
 * The simplest use case is to plop down a `TextInput` and subscribe to the
 * `onChangeText` events to read the user input. There are also other events,
 * such as `onSubmitEditing` and `onFocus` that can be subscribed to. A simple
 * example:
 *
 * ```ReactNativeWebPlayer
 * import React, { Component } from 'react';
 * import { AppRegistry, TextInput } from 'react-native';
 *
 * export default class UselessTextInput extends Component {
 *   constructor(props) {
 *     super(props);
 *     this.state = { text: 'Useless Placeholder' };
 *   }
 *
 *   render() {
 *     return (
 *       <TextInput
 *         style={{height: 40, borderColor: 'gray', borderWidth: 1}}
 *         onChangeText={(text) => this.setState({text})}
 *         value={this.state.text}
 *       />
 *     );
 *   }
 * }
 *
 * // skip this line if using Create React Native App
 * AppRegistry.registerComponent('AwesomeProject', () => UselessTextInput);
 * ```
 *
 * Two methods exposed via the native element are .focus() and .blur() that
 * will focus or blur the TextInput programmatically.
 *
 * Note that some props are only available with `multiline={true/false}`.
 * Additionally, border styles that apply to only one side of the element
 * (e.g., `borderBottomColor`, `borderLeftWidth`, etc.) will not be applied if
 * `multiline=false`. To achieve the same effect, you can wrap your `TextInput`
 * in a `View`:
 *
 * ```ReactNativeWebPlayer
 * import React, { Component } from 'react';
 * import { AppRegistry, View, TextInput } from 'react-native';
 *
 * class UselessTextInput extends Component {
 *   render() {
 *     return (
 *       <TextInput
 *         {...this.props} // Inherit any props passed to it; e.g., multiline, numberOfLines below
 *         editable = {true}
 *         maxLength = {40}
 *       />
 *     );
 *   }
 * }
 *
 * export default class UselessTextInputMultiline extends Component {
 *   constructor(props) {
 *     super(props);
 *     this.state = {
 *       text: 'Useless Multiline Placeholder',
 *     };
 *   }
 *
 *   // If you type something in the text box that is a color, the background will change to that
 *   // color.
 *   render() {
 *     return (
 *      <View style={{
 *        backgroundColor: this.state.text,
 *        borderBottomColor: '#000000',
 *        borderBottomWidth: 1 }}
 *      >
 *        <UselessTextInput
 *          multiline = {true}
 *          numberOfLines = {4}
 *          onChangeText={(text) => this.setState({text})}
 *          value={this.state.text}
 *        />
 *      </View>
 *     );
 *   }
 * }
 *
 * // skip these lines if using Create React Native App
 * AppRegistry.registerComponent(
 *  'AwesomeProject',
 *  () => UselessTextInputMultiline
 * );
 * ```
 *
 * `TextInput` has by default a border at the bottom of its view. This border
 * has its padding set by the background image provided by the system, and it
 * cannot be changed. Solutions to avoid this is to either not set height
 * explicitly, case in which the system will take care of displaying the border
 * in the correct position, or to not display the border by setting
 * `underlineColorAndroid` to transparent.
 *
 * Note that on Android performing text selection in input can change
 * app's activity `windowSoftInputMode` param to `adjustResize`.
 * This may cause issues with components that have position: 'absolute'
 * while keyboard is active. To avoid this behavior either specify `windowSoftInputMode`
 * in AndroidManifest.xml ( https://developer.android.com/guide/topics/manifest/activity-element.html )
 * or control this param programmatically with native code.
 *
 */
function InternalTextInput(props) {
  const inputRef = useRef(null);

  // Android sends a "onTextChanged" event followed by a "onSelectionChanged" event, for
  // the same "most recent event count".
  // For controlled selection, that means that immediately after text is updated,
  // a controlled component will pass in the *previous* selection, even if the controlled
  // component didn't mean to modify the selection at all.
  // Therefore, we ignore selections and pass them through until the selection event has
  // been sent.
  // Note that this mitigation is NOT needed for Fabric.
  // discovered when upgrading react-hooks
  // eslint-disable-next-line react-hooks/exhaustive-deps
  let selection =
    props.selection == null
      ? null
      : {
          start: props.selection.start,
          end: props.selection.end ?? props.selection.start,
        };

  const [mostRecentEventCount, setMostRecentEventCount] = useState(0);

  const [lastNativeText, setLastNativeText] = useState(props.value);
  const [lastNativeSelectionState, setLastNativeSelection] = useState({selection, mostRecentEventCount});

  const lastNativeSelection = lastNativeSelectionState.selection;
  const lastNativeSelectionEventCount =
    lastNativeSelectionState.mostRecentEventCount;

  if (lastNativeSelectionEventCount < mostRecentEventCount) {
    selection = null;
  }

  let viewCommands;
  if (AndroidTextInputCommands) {
    viewCommands = AndroidTextInputCommands;
  } else {
    viewCommands =
      props.multiline === true
        ? RCTMultilineTextInputNativeCommands
        : RCTSinglelineTextInputNativeCommands;
  }

  const text =
    typeof props.value === 'string'
      ? props.value
      : typeof props.defaultValue === 'string'
      ? props.defaultValue
      : '';

  // This is necessary in case native updates the text and JS decides
  // that the update should be ignored and we should stick with the value
  // that we have in JS.
  useLayoutEffect(() => {
    const nativeUpdate = {};

    if (lastNativeText !== props.value && typeof props.value === 'string') {
      nativeUpdate.text = props.value;
      setLastNativeText(props.value);
    }

    if (
      selection &&
      lastNativeSelection &&
      (lastNativeSelection.start !== selection.start ||
        lastNativeSelection.end !== selection.end)
    ) {
      nativeUpdate.selection = selection;
      setLastNativeSelection({selection, mostRecentEventCount});
    }

    if (Object.keys(nativeUpdate).length === 0) {
      return;
    }

    if (inputRef.current != null) {
      viewCommands.setTextAndSelection(
        inputRef.current,
        mostRecentEventCount,
        text,
        selection?.start ?? -1,
        selection?.end ?? -1,
      );
    }
  }, [
    mostRecentEventCount,
    inputRef,
    props.value,
    props.defaultValue,
    lastNativeText,
    selection,
    lastNativeSelection,
    text,
    viewCommands,
  ]);

  useLayoutEffect(() => {
    const inputRefValue = inputRef.current;

    if (inputRefValue != null) {
      TextInputState.registerInput(inputRefValue);

      return () => {
        TextInputState.unregisterInput(inputRefValue);

        if (TextInputState.currentlyFocusedInput() === inputRefValue) {
          nullthrows(inputRefValue).blur();
        }
      };
    }
  }, [inputRef]);

  function clear() {
    if (inputRef.current != null) {
      viewCommands.setTextAndSelection(
        inputRef.current,
        mostRecentEventCount,
        '',
        0,
        0,
      );
    }
  }

  function setSelection(start, end) {
    if (inputRef.current != null) {
      viewCommands.setTextAndSelection(
        inputRef.current,
        mostRecentEventCount,
        null,
        start,
        end,
      );
    }
  }

  // TODO: Fix this returning true on null === null, when no input is focused
  function isFocused() {
    return TextInputState.currentlyFocusedInput() === inputRef.current;
  }

  function getNativeRef() {
    return inputRef.current;
  }

  const _setNativeRef = setAndForwardRef({
    getForwardedRef: () => props.forwardedRef,
    setLocalRef: ref => {
      inputRef.current = ref;

      /*
        Hi reader from the future. I'm sorry for this.

        This is a hack. Ideally we would forwardRef to the underlying
        host component. However, since TextInput has it's own methods that can be
        called as well, if we used the standard forwardRef then these
        methods wouldn't be accessible and thus be a breaking change.

        We have a couple of options of how to handle this:
        - Return a new ref with everything we methods from both. This is problematic
          because we need React to also know it is a host component which requires
          internals of the class implementation of the ref.
        - Break the API and have some other way to call one set of the methods or
          the other. This is our long term approach as we want to eventually
          get the methods on host components off the ref. So instead of calling
          ref.measure() you might call ReactNative.measure(ref). This would hopefully
          let the ref for TextInput then have the methods like `.clear`. Or we do it
          the other way and make it TextInput.clear(textInputRef) which would be fine
          too. Either way though is a breaking change that is longer term.
        - Mutate this ref. :( Gross, but accomplishes what we need in the meantime
          before we can get to the long term breaking change.
        */
      if (ref) {
        ref.clear = clear;
        ref.isFocused = isFocused;
        ref.getNativeRef = getNativeRef;
        ref.setSelection = setSelection;
      }
    },
  });

  const _onChange = (event) => {
    const currentText = event.nativeEvent.text;
    props.onChange && props.onChange(event);
    props.onChangeText && props.onChangeText(currentText);

    if (inputRef.current == null) {
      // calling `props.onChange` or `props.onChangeText`
      // may clean up the input itself. Exits here.
      return;
    }

    setLastNativeText(currentText);
    // This must happen last, after we call setLastNativeText.
    // Different ordering can cause bugs when editing AndroidTextInputs
    // with multiple Fragments.
    // We must update this so that controlled input updates work.
    setMostRecentEventCount(event.nativeEvent.eventCount);
  };

  const _onChangeSync = (event) => {
    const currentText = event.nativeEvent.text;
    props.unstable_onChangeSync && props.unstable_onChangeSync(event);
    props.unstable_onChangeTextSync &&
      props.unstable_onChangeTextSync(currentText);

    if (inputRef.current == null) {
      // calling `props.onChange` or `props.onChangeText`
      // may clean up the input itself. Exits here.
      return;
    }

    setLastNativeText(currentText);
    // This must happen last, after we call setLastNativeText.
    // Different ordering can cause bugs when editing AndroidTextInputs
    // with multiple Fragments.
    // We must update this so that controlled input updates work.
    setMostRecentEventCount(event.nativeEvent.eventCount);
  };

  const _onSelectionChange = (event) => {
    props.onSelectionChange && props.onSelectionChange(event);

    if (inputRef.current == null) {
      // calling `props.onSelectionChange`
      // may clean up the input itself. Exits here.
      return;
    }

    setLastNativeSelection({
      selection: event.nativeEvent.selection,
      mostRecentEventCount,
    });
  };

  const _onFocus = (event) => {
    TextInputState.focusInput(inputRef.current);
    if (props.onFocus) {
      props.onFocus(event);
    }
  };

  const _onBlur = (event) => {
    TextInputState.blurInput(inputRef.current);
    if (props.onBlur) {
      props.onBlur(event);
    }
  };

  const _onScroll = (event) => {
    props.onScroll && props.onScroll(event);
  };

  let textInput = null;

  const multiline = props.multiline ?? false;

  let submitBehavior;
  if (props.submitBehavior != null) {
    // `submitBehavior` is set explicitly
    if (!multiline && props.submitBehavior === 'newline') {
      // For single line text inputs, `'newline'` is not a valid option
      submitBehavior = 'blurAndSubmit';
    } else {
      submitBehavior = props.submitBehavior;
    }
  } else if (multiline) {
    if (props.blurOnSubmit === true) {
      submitBehavior = 'blurAndSubmit';
    } else {
      submitBehavior = 'newline';
    }
  } else {
    // Single line
    if (props.blurOnSubmit !== false) {
      submitBehavior = 'blurAndSubmit';
    } else {
      submitBehavior = 'submit';
    }
  }

  const accessible = props.accessible !== false;
  const focusable = props.focusable !== false;

  const config = React.useMemo(
    () => ({
      onPress: (event) => {
        if (props.editable !== false) {
          if (inputRef.current != null) {
            inputRef.current.focus();
          }
        }
      },
      onPressIn: props.onPressIn,
      onPressOut: props.onPressOut,
      cancelable:
        Platform.OS === 'ios' ? !props.rejectResponderTermination : null,
    }),
    [
      props.editable,
      props.onPressIn,
      props.onPressOut,
      props.rejectResponderTermination,
    ],
  );

  // Hide caret during test runs due to a flashing caret
  // makes screenshot tests flakey
  let caretHidden = props.caretHidden;
  if (Platform.isTesting) {
    caretHidden = true;
  }

  // TextInput handles onBlur and onFocus events
  // so omitting onBlur and onFocus pressability handlers here.
  const {onBlur, onFocus, ...eventHandlers} = usePressability(config) || {};

  const _accessibilityState = {
    busy: props['aria-busy'] ?? props.accessibilityState?.busy,
    checked: props['aria-checked'] ?? props.accessibilityState?.checked,
    disabled: props['aria-disabled'] ?? props.accessibilityState?.disabled,
    expanded: props['aria-expanded'] ?? props.accessibilityState?.expanded,
    selected: props['aria-selected'] ?? props.accessibilityState?.selected,
  };

  if (Platform.OS === 'ios') {
    const RCTTextInputView =
      props.multiline === true
        ? RCTMultilineTextInputView
        : RCTSinglelineTextInputView;

    const style =
      props.multiline === true
        ? StyleSheet.flatten([styles.multilineInput, props.style])
        : props.style;

    const useOnChangeSync =
      (props.unstable_onChangeSync || props.unstable_onChangeTextSync) &&
      !(props.onChange || props.onChangeText);

    textInput = (
      <RCTTextInputView
        ref={_setNativeRef}
        {...props}
        {...eventHandlers}
        accessible={accessible}
        accessibilityState={_accessibilityState}
        submitBehavior={submitBehavior}
        caretHidden={caretHidden}
        dataDetectorTypes={props.dataDetectorTypes}
        focusable={focusable}
        mostRecentEventCount={mostRecentEventCount}
        onBlur={_onBlur}
        onKeyPressSync={props.unstable_onKeyPressSync}
        onChange={_onChange}
        onChangeSync={useOnChangeSync === true ? _onChangeSync : null}
        onContentSizeChange={props.onContentSizeChange}
        onFocus={_onFocus}
        onScroll={_onScroll}
        onSelectionChange={_onSelectionChange}
        onSelectionChangeShouldSetResponder={emptyFunctionThatReturnsTrue}
        selection={selection}
        style={style}
        text={text}
      />
    );
  } else if (Platform.OS === 'android') {
    const style = [props.style];
    const autoCapitalize = props.autoCapitalize || 'sentences';
    const _accessibilityLabelledBy =
      props?.['aria-labelledby'] ?? props?.accessibilityLabelledBy;
    const placeholder = props.placeholder ?? '';
    let children = props.children;
    const childCount = React.Children.count(children);
    invariant(
      !(props.value != null && childCount),
      'Cannot specify both value and children.',
    );
    if (childCount > 1) {
      children = <Text>{children}</Text>;
    }

    textInput = (
      /* $FlowFixMe[prop-missing] the types for AndroidTextInput don't match up
       * exactly with the props for TextInput. This will need to get fixed */
      /* $FlowFixMe[incompatible-type] the types for AndroidTextInput don't
       * match up exactly with the props for TextInput. This will need to get
       * fixed */
      /* $FlowFixMe[incompatible-type-arg] the types for AndroidTextInput don't
       * match up exactly with the props for TextInput. This will need to get
       * fixed */
      <AndroidTextInput
        ref={_setNativeRef}
        {...props}
        {...eventHandlers}
        accessible={accessible}
        accessibilityState={_accessibilityState}
        accessibilityLabelledBy={_accessibilityLabelledBy}
        autoCapitalize={autoCapitalize}
        submitBehavior={submitBehavior}
        caretHidden={caretHidden}
        children={children}
        disableFullscreenUI={props.disableFullscreenUI}
        focusable={focusable}
        mostRecentEventCount={mostRecentEventCount}
        numberOfLines={props.rows ?? props.numberOfLines}
        onBlur={_onBlur}
        onChange={_onChange}
        onFocus={_onFocus}
        /* $FlowFixMe[prop-missing] the types for AndroidTextInput don't match
         * up exactly with the props for TextInput. This will need to get fixed
         */
        /* $FlowFixMe[incompatible-type-arg] the types for AndroidTextInput
         * don't match up exactly with the props for TextInput. This will need
         * to get fixed */
        onScroll={_onScroll}
        onSelectionChange={_onSelectionChange}
        placeholder={placeholder}
        selection={selection}
        style={style}
        text={text}
        textBreakStrategy={props.textBreakStrategy}
      />
    );
  }
  return (
    <TextAncestor.Provider value={true}>{textInput}</TextAncestor.Provider>
  );
}

const enterKeyHintToReturnTypeMap = {
  enter: 'default',
  done: 'done',
  go: 'go',
  next: 'next',
  previous: 'previous',
  search: 'search',
  send: 'send',
};

const inputModeToKeyboardTypeMap = {
  none: 'default',
  text: 'default',
  decimal: 'decimal-pad',
  numeric: 'number-pad',
  tel: 'phone-pad',
  search: Platform.OS === 'ios' ? 'web-search' : 'default',
  email: 'email-address',
  url: 'url',
};

// Map HTML autocomplete values to Android autoComplete values
const autoCompleteWebToAutoCompleteAndroidMap = {
  'address-line1': 'postal-address-region',
  'address-line2': 'postal-address-locality',
  bday: 'birthdate-full',
  'bday-day': 'birthdate-day',
  'bday-month': 'birthdate-month',
  'bday-year': 'birthdate-year',
  'cc-csc': 'cc-csc',
  'cc-exp': 'cc-exp',
  'cc-exp-month': 'cc-exp-month',
  'cc-exp-year': 'cc-exp-year',
  'cc-number': 'cc-number',
  country: 'postal-address-country',
  'current-password': 'password',
  email: 'email',
  'honorific-prefix': 'name-prefix',
  'honorific-suffix': 'name-suffix',
  name: 'name',
  'additional-name': 'name-middle',
  'family-name': 'name-family',
  'given-name': 'name-given',
  'new-password': 'password-new',
  off: 'off',
  'one-time-code': 'sms-otp',
  'postal-code': 'postal-code',
  sex: 'gender',
  'street-address': 'street-address',
  tel: 'tel',
  'tel-country-code': 'tel-country-code',
  'tel-national': 'tel-national',
  username: 'username',
};

// Map HTML autocomplete values to iOS textContentType values
const autoCompleteWebToTextContentTypeMap = {
  'address-line1': 'streetAddressLine1',
  'address-line2': 'streetAddressLine2',
  'cc-number': 'creditCardNumber',
  'current-password': 'password',
  country: 'countryName',
  email: 'emailAddress',
  name: 'name',
  'additional-name': 'middleName',
  'family-name': 'familyName',
  'given-name': 'givenName',
  nickname: 'nickname',
  'honorific-prefix': 'namePrefix',
  'honorific-suffix': 'nameSuffix',
  'new-password': 'newPassword',
  off: 'none',
  'one-time-code': 'oneTimeCode',
  organization: 'organizationName',
  'organization-title': 'jobTitle',
  'postal-code': 'postalCode',
  'street-address': 'fullStreetAddress',
  tel: 'telephoneNumber',
  url: 'URL',
  username: 'username',
};

const ExportedForwardRef = React.forwardRef(function TextInput(
  {
    allowFontScaling = true,
    rejectResponderTermination = true,
    underlineColorAndroid = 'transparent',
    autoComplete,
    textContentType,
    readOnly,
    editable,
    enterKeyHint,
    returnKeyType,
    inputMode,
    keyboardType,
    ...restProps
  },
  forwardedRef,
) {
  const style = flattenStyle(restProps.style);

  if (style?.verticalAlign != null) {
    style.textAlignVertical =
      verticalAlignToTextAlignVerticalMap[style.verticalAlign];
  }

  return (
    <InternalTextInput
      allowFontScaling={allowFontScaling}
      rejectResponderTermination={rejectResponderTermination}
      underlineColorAndroid={underlineColorAndroid}
      editable={readOnly !== undefined ? !readOnly : editable}
      returnKeyType={
        enterKeyHint ? enterKeyHintToReturnTypeMap[enterKeyHint] : returnKeyType
      }
      keyboardType={
        inputMode ? inputModeToKeyboardTypeMap[inputMode] : keyboardType
      }
      autoComplete={
        Platform.OS === 'android'
          ? // $FlowFixMe
            autoCompleteWebToAutoCompleteAndroidMap[autoComplete] ??
            autoComplete
          : undefined
      }
      textContentType={
        Platform.OS === 'ios' &&
        autoComplete &&
        autoComplete in autoCompleteWebToTextContentTypeMap
          ? // $FlowFixMe
            autoCompleteWebToTextContentTypeMap[autoComplete]
          : textContentType
      }
      {...restProps}
      forwardedRef={forwardedRef}
      style={style}
    />
  );
});

/**
 * Switch to `deprecated-react-native-prop-types` for compatibility with future
 * releases. This is deprecated and will be removed in the future.
 */
ExportedForwardRef.propTypes =
  require('deprecated-react-native-prop-types').TextInputPropTypes;

// $FlowFixMe[prop-missing]
ExportedForwardRef.State = {
  currentlyFocusedInput: TextInputState.currentlyFocusedInput,

  currentlyFocusedField: TextInputState.currentlyFocusedField,
  focusTextInput: TextInputState.focusTextInput,
  blurTextInput: TextInputState.blurTextInput,
};


const styles = StyleSheet.create({
  multilineInput: {
    // This default top inset makes RCTMultilineTextInputView seem as close as possible
    // to single-line RCTSinglelineTextInputView defaults, using the system defaults
    // of font size 17 and a height of 31 points.
    paddingTop: 5,
  },
});

const verticalAlignToTextAlignVerticalMap = {
  auto: 'auto',
  top: 'top',
  bottom: 'bottom',
  middle: 'center',
};

// $FlowFixMe[unclear-type] Unclear type. Using `any` type is not safe.
module.exports = ((ExportedForwardRef));
