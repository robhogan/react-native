/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 *  strict-local
 */


import NativeEventEmitter from '../EventEmitter/NativeEventEmitter';
import {VirtualizedListContextResetter} from '../Lists/VirtualizedListContext.js';
import {} from '../vendor/emitter/EventEmitter';
import ModalInjection from './ModalInjection';
import NativeModalManager from './NativeModalManager';
import RCTModalHostView from './RCTModalHostViewNativeComponent';

const ScrollView = require('../Components/ScrollView/ScrollView');
const View = require('../Components/View/View');
const AppContainer = require('../ReactNative/AppContainer');
const I18nManager = require('../ReactNative/I18nManager');
const {RootTagContext} = require('../ReactNative/RootTag');
const StyleSheet = require('../StyleSheet/StyleSheet');
const Platform = require('../Utilities/Platform');
const React = require('react');


const ModalEventEmitter =
  Platform.OS === 'ios' && NativeModalManager != null
    ? new NativeEventEmitter(
        // T88715063: NativeEventEmitter only used this parameter on iOS. Now it uses it on all platforms, so this code was modified automatically to preserve its behavior
        // If you want to use the native module on other platforms, please remove this condition and test its behavior
        Platform.OS !== 'ios' ? null : NativeModalManager,
      )
    : null;

/**
 * The Modal component is a simple way to present content above an enclosing view.
 *
 * See https://reactnative.dev/docs/modal
 */

// In order to route onDismiss callbacks, we need to uniquely identifier each
// <Modal> on screen. There can be different ones, either nested or as siblings.
// We cannot pass the onDismiss callback to native as the view will be
// destroyed before the callback is fired.
let uniqueModalIdentifier = 0;



function confirmProps(props) {
  if (__DEV__) {
    if (
      props.presentationStyle &&
      props.presentationStyle !== 'overFullScreen' &&
      props.transparent === true
    ) {
      console.warn(
        `Modal with '${props.presentationStyle}' presentation style and 'transparent' value is not supported.`,
      );
    }
  }
}

class Modal extends React.Component {
  static defaultProps = {
    visible: true,
    hardwareAccelerated: false,
  };

  static contextType = RootTagContext;

  _identifier;
  _eventSubscription;

  constructor(props) {
    super(props);
    if (__DEV__) {
      confirmProps(props);
    }
    this._identifier = uniqueModalIdentifier++;
  }

  componentDidMount() {
    // 'modalDismissed' is for the old renderer in iOS only
    if (ModalEventEmitter) {
      this._eventSubscription = ModalEventEmitter.addListener(
        'modalDismissed',
        event => {
          if (event.modalID === this._identifier && this.props.onDismiss) {
            this.props.onDismiss();
          }
        },
      );
    }
  }

  componentWillUnmount() {
    if (this._eventSubscription) {
      this._eventSubscription.remove();
    }
  }

  componentDidUpdate() {
    if (__DEV__) {
      confirmProps(this.props);
    }
  }

  render() {
    if (this.props.visible !== true) {
      return null;
    }

    const containerStyles = {
      backgroundColor:
        this.props.transparent === true ? 'transparent' : 'white',
    };

    let animationType = this.props.animationType || 'none';

    let presentationStyle = this.props.presentationStyle;
    if (!presentationStyle) {
      presentationStyle = 'fullScreen';
      if (this.props.transparent === true) {
        presentationStyle = 'overFullScreen';
      }
    }

    const innerChildren = __DEV__ ? (
      <AppContainer rootTag={this.context}>{this.props.children}</AppContainer>
    ) : (
      this.props.children
    );

    return (
      <RCTModalHostView
        animationType={animationType}
        presentationStyle={presentationStyle}
        transparent={this.props.transparent}
        hardwareAccelerated={this.props.hardwareAccelerated}
        onRequestClose={this.props.onRequestClose}
        onShow={this.props.onShow}
        onDismiss={() => {
          if (this.props.onDismiss) {
            this.props.onDismiss();
          }
        }}
        visible={this.props.visible}
        statusBarTranslucent={this.props.statusBarTranslucent}
        identifier={this._identifier}
        style={styles.modal}
        // $FlowFixMe[method-unbinding] added when improving typing for this parameters
        onStartShouldSetResponder={this._shouldSetResponder}
        supportedOrientations={this.props.supportedOrientations}
        onOrientationChange={this.props.onOrientationChange}
        testID={this.props.testID}>
        <VirtualizedListContextResetter>
          <ScrollView.Context.Provider value={null}>
            <View
              style={[styles.container, containerStyles]}
              collapsable={false}>
              {innerChildren}
            </View>
          </ScrollView.Context.Provider>
        </VirtualizedListContextResetter>
      </RCTModalHostView>
    );
  }

  // We don't want any responder events bubbling out of the modal.
  _shouldSetResponder() {
    return true;
  }
}

const side = I18nManager.getConstants().isRTL ? 'right' : 'left';
const styles = StyleSheet.create({
  modal: {
    position: 'absolute',
  },
  container: {
    /* $FlowFixMe[invalid-computed-prop] (>=0.111.0 site=react_native_fb) This
     * comment suppresses an error found when Flow v0.111 was deployed. To see
     * the error, delete this comment and run Flow. */
    [side]: 0,
    top: 0,
    flex: 1,
  },
});

const ExportedModal = ModalInjection.unstable_Modal ?? Modal;

module.exports = ExportedModal;
