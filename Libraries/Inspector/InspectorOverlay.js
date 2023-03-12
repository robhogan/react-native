/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 */

'use strict';


const View = require('../Components/View/View');
const StyleSheet = require('../StyleSheet/StyleSheet');
const Dimensions = require('../Utilities/Dimensions');
const ElementBox = require('./ElementBox');
const React = require('react');



class InspectorOverlay extends React.Component {
  findViewForTouchEvent = (e) => {
    const {locationX, locationY} = e.nativeEvent.touches[0];

    this.props.onTouchPoint(locationX, locationY);
  };

  shouldSetResponser = (e) => {
    this.findViewForTouchEvent(e);
    return true;
  };

  render() {
    let content = null;
    if (this.props.inspected) {
      content = (
        <ElementBox
          frame={this.props.inspected.frame}
          style={this.props.inspected.style}
        />
      );
    }

    return (
      <View
        onStartShouldSetResponder={this.shouldSetResponser}
        onResponderMove={this.findViewForTouchEvent}
        nativeID="inspectorOverlay" /* TODO: T68258846. */
        style={[styles.inspector, {height: Dimensions.get('window').height}]}>
        {content}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inspector: {
    backgroundColor: 'transparent',
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
  },
});

module.exports = InspectorOverlay;
