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


const ReactNativeStyleAttributes = require('../Components/View/ReactNativeStyleAttributes');
const View = require('../Components/View/View');
const PressabilityDebug = require('../Pressability/PressabilityDebug');
const {findNodeHandle} = require('../ReactNative/RendererProxy');
const StyleSheet = require('../StyleSheet/StyleSheet');
const Dimensions = require('../Utilities/Dimensions');
const Platform = require('../Utilities/Platform');
const getInspectorDataForViewAtPoint = require('./getInspectorDataForViewAtPoint');
const InspectorOverlay = require('./InspectorOverlay');
const InspectorPanel = require('./InspectorPanel');
const React = require('react');

const hook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;

// Required for React DevTools to view/edit React Native styles in Flipper.
// Flipper doesn't inject these values when initializing DevTools.
hook.resolveRNStyle = require('../StyleSheet/flattenStyle');
hook.nativeStyleEditorValidAttributes = Object.keys(ReactNativeStyleAttributes);

class Inspector extends React.Component {
  _hideTimeoutID = null;
  _subs;
  _setTouchedViewData;

  constructor(props) {
    super(props);

    this.state = {
      devtoolsAgent: null,
      hierarchy: null,
      panelPos: 'bottom',
      inspecting: true,
      perfing: false,
      inspected: null,
      selection: null,
      inspectedView: this.props.inspectedView,
      networking: false,
    };
  }

  componentDidMount() {
    hook.on('react-devtools', this._attachToDevtools);
    // if devtools is already started
    if (hook.reactDevtoolsAgent) {
      this._attachToDevtools(hook.reactDevtoolsAgent);
    }
  }

  componentWillUnmount() {
    if (this._subs) {
      this._subs.map(fn => fn());
    }
    hook.off('react-devtools', this._attachToDevtools);
    this._setTouchedViewData = null;
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    this.setState({inspectedView: newProps.inspectedView});
  }

  _attachToDevtools = (agent) => {
    agent.addListener('shutdown', this._onAgentShutdown);

    this.setState({
      devtoolsAgent: agent,
    });
  };

  _onAgentShutdown = () => {
    const agent = this.state.devtoolsAgent;
    if (agent != null) {
      agent.removeListener('shutdown', this._onAgentShutdown);

      this.setState({devtoolsAgent: null});
    }
  };

  setSelection(i) {
    const hierarchyItem = this.state.hierarchy[i];
    // we pass in findNodeHandle as the method is injected
    const {measure, props, source} =
      hierarchyItem.getInspectorData(findNodeHandle);

    measure((x, y, width, height, left, top) => {
      this.setState({
        inspected: {
          frame: {left, top, width, height},
          style: props.style,
          source,
        },
        selection: i,
      });
    });
  }

  onTouchPoint(locationX, locationY) {
    this._setTouchedViewData = viewData => {
      const {
        hierarchy,
        props,
        selectedIndex,
        source,
        frame,
        pointerY,
        touchedViewTag,
        closestInstance,
      } = viewData;

      // Sync the touched view with React DevTools.
      // Note: This is Paper only. To support Fabric,
      // DevTools needs to be updated to not rely on view tags.
      if (this.state.devtoolsAgent) {
        if (closestInstance != null) {
          // Fabric
          this.state.devtoolsAgent.selectNode(closestInstance);
        } else if (touchedViewTag != null) {
          this.state.devtoolsAgent.selectNode(findNodeHandle(touchedViewTag));
        }
      }

      this.setState({
        panelPos:
          pointerY > Dimensions.get('window').height / 2 ? 'top' : 'bottom',
        selection: selectedIndex,
        hierarchy,
        inspected: {
          style: props.style,
          frame,
          source,
        },
      });
    };
    getInspectorDataForViewAtPoint(
      this.state.inspectedView,
      locationX,
      locationY,
      viewData => {
        if (this._setTouchedViewData != null) {
          this._setTouchedViewData(viewData);
          this._setTouchedViewData = null;
        }
        return false;
      },
    );
  }

  setPerfing(val) {
    this.setState({
      perfing: val,
      inspecting: false,
      inspected: null,
      networking: false,
    });
  }

  setInspecting(val) {
    this.setState({
      inspecting: val,
      inspected: null,
    });
  }

  setTouchTargeting(val) {
    PressabilityDebug.setEnabled(val);
    this.props.onRequestRerenderApp(inspectedView => {
      this.setState({inspectedView});
    });
  }

  setNetworking(val) {
    this.setState({
      networking: val,
      perfing: false,
      inspecting: false,
      inspected: null,
    });
  }

  render() {
    const panelContainerStyle =
      this.state.panelPos === 'bottom'
        ? {bottom: 0}
        : {top: Platform.OS === 'ios' ? 20 : 0};
    return (
      <View style={styles.container} pointerEvents="box-none">
        {this.state.inspecting && (
          <InspectorOverlay
            inspected={this.state.inspected}
            // $FlowFixMe[method-unbinding] added when improving typing for this parameters
            onTouchPoint={this.onTouchPoint.bind(this)}
          />
        )}
        <View style={[styles.panelContainer, panelContainerStyle]}>
          <InspectorPanel
            devtoolsIsOpen={!!this.state.devtoolsAgent}
            inspecting={this.state.inspecting}
            perfing={this.state.perfing}
            // $FlowFixMe[method-unbinding] added when improving typing for this parameters
            setPerfing={this.setPerfing.bind(this)}
            // $FlowFixMe[method-unbinding] added when improving typing for this parameters
            setInspecting={this.setInspecting.bind(this)}
            inspected={this.state.inspected}
            hierarchy={this.state.hierarchy}
            selection={this.state.selection}
            // $FlowFixMe[method-unbinding] added when improving typing for this parameters
            setSelection={this.setSelection.bind(this)}
            touchTargeting={PressabilityDebug.isEnabled()}
            // $FlowFixMe[method-unbinding] added when improving typing for this parameters
            setTouchTargeting={this.setTouchTargeting.bind(this)}
            networking={this.state.networking}
            // $FlowFixMe[method-unbinding] added when improving typing for this parameters
            setNetworking={this.setNetworking.bind(this)}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    backgroundColor: 'transparent',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  panelContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
});

module.exports = Inspector;
