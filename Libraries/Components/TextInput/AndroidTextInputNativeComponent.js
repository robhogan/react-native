/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *  strict-local
 * @format
 */

import codegenNativeCommands from '../../Utilities/codegenNativeCommands';
import * as NativeComponentRegistry from '../../NativeComponent/NativeComponentRegistry';






export const Commands = codegenNativeCommands({
  supportedCommands: ['focus', 'blur', 'setTextAndSelection'],
});

export const __INTERNAL_VIEW_CONFIG = {
  uiViewClassName: 'AndroidTextInput',
  bubblingEventTypes: {
    topBlur: {
      phasedRegistrationNames: {
        bubbled: 'onBlur',
        captured: 'onBlurCapture',
      },
    },
    topEndEditing: {
      phasedRegistrationNames: {
        bubbled: 'onEndEditing',
        captured: 'onEndEditingCapture',
      },
    },
    topFocus: {
      phasedRegistrationNames: {
        bubbled: 'onFocus',
        captured: 'onFocusCapture',
      },
    },
    topKeyPress: {
      phasedRegistrationNames: {
        bubbled: 'onKeyPress',
        captured: 'onKeyPressCapture',
      },
    },
    topSubmitEditing: {
      phasedRegistrationNames: {
        bubbled: 'onSubmitEditing',
        captured: 'onSubmitEditingCapture',
      },
    },
    topTextInput: {
      phasedRegistrationNames: {
        bubbled: 'onTextInput',
        captured: 'onTextInputCapture',
      },
    },
  },
  directEventTypes: {
    topScroll: {
      registrationName: 'onScroll',
    },
  },
  validAttributes: {
    maxFontSizeMultiplier: true,
    adjustsFontSizeToFit: true,
    minimumFontScale: true,
    autoFocus: true,
    placeholder: true,
    inlineImagePadding: true,
    contextMenuHidden: true,
    textShadowColor: {process: require('../../StyleSheet/processColor')},
    maxLength: true,
    selectTextOnFocus: true,
    textShadowRadius: true,
    underlineColorAndroid: {
      process: require('../../StyleSheet/processColor'),
    },
    textDecorationLine: true,
    blurOnSubmit: true,
    textAlignVertical: true,
    fontStyle: true,
    textShadowOffset: true,
    selectionColor: {process: require('../../StyleSheet/processColor')},
    selection: true,
    placeholderTextColor: {process: require('../../StyleSheet/processColor')},
    importantForAutofill: true,
    lineHeight: true,
    textTransform: true,
    returnKeyType: true,
    keyboardType: true,
    multiline: true,
    color: {process: require('../../StyleSheet/processColor')},
    autoComplete: true,
    numberOfLines: true,
    letterSpacing: true,
    returnKeyLabel: true,
    fontSize: true,
    onKeyPress: true,
    cursorColor: {process: require('../../StyleSheet/processColor')},
    text: true,
    showSoftInputOnFocus: true,
    textAlign: true,
    autoCapitalize: true,
    autoCorrect: true,
    caretHidden: true,
    secureTextEntry: true,
    textBreakStrategy: true,
    onScroll: true,
    onContentSizeChange: true,
    disableFullscreenUI: true,
    includeFontPadding: true,
    fontWeight: true,
    fontFamily: true,
    allowFontScaling: true,
    onSelectionChange: true,
    mostRecentEventCount: true,
    inlineImageLeft: true,
    editable: true,
    fontVariant: true,
    borderBottomRightRadius: true,
    borderBottomColor: {process: require('../../StyleSheet/processColor')},
    borderRadius: true,
    borderRightColor: {process: require('../../StyleSheet/processColor')},
    borderColor: {process: require('../../StyleSheet/processColor')},
    borderTopRightRadius: true,
    borderStyle: true,
    borderBottomLeftRadius: true,
    borderLeftColor: {process: require('../../StyleSheet/processColor')},
    borderTopLeftRadius: true,
    borderTopColor: {process: require('../../StyleSheet/processColor')},
  },
};

let AndroidTextInputNativeComponent = NativeComponentRegistry.get(
  'AndroidTextInput',
  () => __INTERNAL_VIEW_CONFIG,
);

// flowlint-next-line unclear-type:off
export default ((AndroidTextInputNativeComponent));
