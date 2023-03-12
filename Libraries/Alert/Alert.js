/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 */


import Platform from '../Utilities/Platform';
import RCTAlertManager from './RCTAlertManager';



/**
 * Launches an alert dialog with the specified title and message.
 *
 * See https://reactnative.dev/docs/alert
 */
class Alert {
  static alert(
    title,
    message,
    buttons,
    options,
  ) {
    if (Platform.OS === 'ios') {
      Alert.prompt(
        title,
        message,
        buttons,
        'default',
        undefined,
        undefined,
        options,
      );
    } else if (Platform.OS === 'android') {
      const NativeDialogManagerAndroid =
        require('../NativeModules/specs/NativeDialogManagerAndroid').default;
      if (!NativeDialogManagerAndroid) {
        return;
      }
      const constants = NativeDialogManagerAndroid.getConstants();

      const config = {
        title: title || '',
        message: message || '',
        cancelable: false,
      };

      if (options && options.cancelable) {
        config.cancelable = options.cancelable;
      }
      // At most three buttons (neutral, negative, positive). Ignore rest.
      // The text 'OK' should be probably localized. iOS Alert does that in native.
      const defaultPositiveText = 'OK';
      const validButtons = buttons
        ? buttons.slice(0, 3)
        : [{text: defaultPositiveText}];
      const buttonPositive = validButtons.pop();
      const buttonNegative = validButtons.pop();
      const buttonNeutral = validButtons.pop();

      if (buttonNeutral) {
        config.buttonNeutral = buttonNeutral.text || '';
      }
      if (buttonNegative) {
        config.buttonNegative = buttonNegative.text || '';
      }
      if (buttonPositive) {
        config.buttonPositive = buttonPositive.text || defaultPositiveText;
      }

      /* $FlowFixMe[missing-local-annot] The type annotation(s) required by
       * Flow's LTI update could not be added via codemod */
      const onAction = (action, buttonKey) => {
        if (action === constants.buttonClicked) {
          if (buttonKey === constants.buttonNeutral) {
            buttonNeutral.onPress && buttonNeutral.onPress();
          } else if (buttonKey === constants.buttonNegative) {
            buttonNegative.onPress && buttonNegative.onPress();
          } else if (buttonKey === constants.buttonPositive) {
            buttonPositive.onPress && buttonPositive.onPress();
          }
        } else if (action === constants.dismissed) {
          options && options.onDismiss && options.onDismiss();
        }
      };
      const onError = (errorMessage) => console.warn(errorMessage);
      NativeDialogManagerAndroid.showAlert(config, onError, onAction);
    }
  }

  static prompt(
    title,
    message,
    callbackOrButtons,
    type = 'plain-text',
    defaultValue,
    keyboardType,
    options,
  ) {
    if (Platform.OS === 'ios') {
      let callbacks = [];
      const buttons = [];
      let cancelButtonKey;
      let destructiveButtonKey;
      if (typeof callbackOrButtons === 'function') {
        callbacks = [callbackOrButtons];
      } else if (Array.isArray(callbackOrButtons)) {
        callbackOrButtons.forEach((btn, index) => {
          callbacks[index] = btn.onPress;
          if (btn.style === 'cancel') {
            cancelButtonKey = String(index);
          } else if (btn.style === 'destructive') {
            destructiveButtonKey = String(index);
          }
          if (btn.text || index < (callbackOrButtons || []).length - 1) {
            const btnDef = {};
            btnDef[index] = btn.text || '';
            buttons.push(btnDef);
          }
        });
      }

      RCTAlertManager.alertWithArgs(
        {
          title: title || '',
          message: message || undefined,
          buttons,
          type: type || undefined,
          defaultValue,
          cancelButtonKey,
          destructiveButtonKey,
          keyboardType,
          userInterfaceStyle: options?.userInterfaceStyle || undefined,
        },
        (id, value) => {
          const cb = callbacks[id];
          cb && cb(value);
        },
      );
    }
  }
}

module.exports = Alert;
