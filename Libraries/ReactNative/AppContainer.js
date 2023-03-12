/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 */

import View from '../Components/View/View';
import RCTDeviceEventEmitter from '../EventEmitter/RCTDeviceEventEmitter';
import StyleSheet from '../StyleSheet/StyleSheet';
import {} from '../vendor/emitter/EventEmitter';
import {RootTagContext, createRootTag} from './RootTag';
import * as React from 'react';



class AppContainer extends React.Component {
  state = {
    inspector: null,
    mainKey: 1,
    hasError: false,
  };
  _mainRef;
  _subscription = null;

  static getDerivedStateFromError = undefined;

  componentDidMount() {
    if (__DEV__) {
      if (!global.__RCTProfileIsProfiling) {
        this._subscription = RCTDeviceEventEmitter.addListener(
          'toggleElementInspector',
          () => {
            const Inspector = require('../Inspector/Inspector');
            const inspector = this.state.inspector ? null : (
              <Inspector
                inspectedView={this._mainRef}
                onRequestRerenderApp={updateInspectedView => {
                  this.setState(
                    s => ({mainKey: s.mainKey + 1}),
                    () => updateInspectedView(this._mainRef),
                  );
                }}
              />
            );
            this.setState({inspector});
          },
        );
      }
    }
  }

  componentWillUnmount() {
    if (this._subscription != null) {
      this._subscription.remove();
    }
  }

  render() {
    let logBox = null;
    if (__DEV__) {
      if (
        !global.__RCTProfileIsProfiling &&
        !this.props.internal_excludeLogBox
      ) {
        const LogBoxNotificationContainer =
          require('../LogBox/LogBoxNotificationContainer').default;
        logBox = <LogBoxNotificationContainer />;
      }
    }

    let innerView = (
      <View
        collapsable={!this.state.inspector}
        key={this.state.mainKey}
        pointerEvents="box-none"
        style={styles.appContainer}
        ref={ref => {
          this._mainRef = ref;
        }}>
        {this.props.children}
      </View>
    );

    const Wrapper = this.props.WrapperComponent;
    if (Wrapper != null) {
      innerView = (
        <Wrapper
          initialProps={this.props.initialProps}
          fabric={this.props.fabric === true}
          showArchitectureIndicator={
            this.props.showArchitectureIndicator === true
          }>
          {innerView}
        </Wrapper>
      );
    }
    return (
      <RootTagContext.Provider value={createRootTag(this.props.rootTag)}>
        <View style={styles.appContainer} pointerEvents="box-none">
          {!this.state.hasError && innerView}
          {this.state.inspector}
          {logBox}
        </View>
      </RootTagContext.Provider>
    );
  }
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
  },
});

module.exports = AppContainer;
