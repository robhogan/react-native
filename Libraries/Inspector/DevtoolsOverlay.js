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
import ReactNativeFeatureFlags from '../ReactNative/ReactNativeFeatureFlags';
import StyleSheet from '../StyleSheet/StyleSheet';
import Dimensions from '../Utilities/Dimensions';
import ElementBox from './ElementBox';
import * as React from 'react';

const {findNodeHandle} = require('../ReactNative/RendererProxy');
const getInspectorDataForViewAtPoint = require('./getInspectorDataForViewAtPoint');

const {useEffect, useState, useCallback, useRef} = React;

const hook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;

export default function DevtoolsOverlay({
  inspectedView,
}) {
  const [inspected, setInspected] = useState(null);
  const [isInspecting, setIsInspecting] = useState(false);
  const devToolsAgentRef = useRef(null);

  useEffect(() => {
    let devToolsAgent = null;
    let hideTimeoutId = null;

    function onAgentHideNativeHighlight() {
      // we wait to actually hide in order to avoid flicker
      clearTimeout(hideTimeoutId);
      hideTimeoutId = setTimeout(() => {
        setInspected(null);
      }, 100);
    }

    function onAgentShowNativeHighlight(node) {
      clearTimeout(hideTimeoutId);
      // Shape of `node` is different in Fabric.
      const component = node.canonical ?? node;
      if (!component || !component.measure) {
        return;
      }

      component.measure((x, y, width, height, left, top) => {
        setInspected({
          frame: {left, top, width, height},
        });
      });
    }

    function cleanup() {
      const currentAgent = devToolsAgent;
      if (currentAgent != null) {
        currentAgent.removeListener(
          'hideNativeHighlight',
          onAgentHideNativeHighlight,
        );
        currentAgent.removeListener(
          'showNativeHighlight',
          onAgentShowNativeHighlight,
        );
        currentAgent.removeListener('shutdown', cleanup);
        currentAgent.removeListener(
          'startInspectingNative',
          onStartInspectingNative,
        );
        currentAgent.removeListener(
          'stopInspectingNative',
          onStopInspectingNative,
        );
        devToolsAgent = null;
      }
      devToolsAgentRef.current = null;
    }

    function onStartInspectingNative() {
      setIsInspecting(true);
    }

    function onStopInspectingNative() {
      setIsInspecting(false);
    }

    function _attachToDevtools(agent) {
      devToolsAgent = agent;
      devToolsAgentRef.current = agent;
      agent.addListener('hideNativeHighlight', onAgentHideNativeHighlight);
      agent.addListener('showNativeHighlight', onAgentShowNativeHighlight);
      agent.addListener('shutdown', cleanup);
      agent.addListener('startInspectingNative', onStartInspectingNative);
      agent.addListener('stopInspectingNative', onStopInspectingNative);
    }

    hook.on('react-devtools', _attachToDevtools);
    if (hook.reactDevtoolsAgent) {
      _attachToDevtools(hook.reactDevtoolsAgent);
    }
    return () => {
      hook.off('react-devtools', _attachToDevtools);
      cleanup();
    };
  }, []);

  const findViewForLocation = useCallback(
    (x, y) => {
      const agent = devToolsAgentRef.current;
      if (agent == null) {
        return;
      }
      getInspectorDataForViewAtPoint(inspectedView, x, y, viewData => {
        const {touchedViewTag, closestInstance, frame} = viewData;
        if (closestInstance != null || touchedViewTag != null) {
          if (closestInstance != null) {
            // Fabric
            agent.selectNode(closestInstance);
          } else {
            agent.selectNode(findNodeHandle(touchedViewTag));
          }
          setInspected({
            frame,
          });
          return true;
        }
        return false;
      });
    },
    [inspectedView],
  );

  const stopInspecting = useCallback(() => {
    const agent = devToolsAgentRef.current;
    if (agent == null) {
      return;
    }
    agent.stopInspectingNative(true);
    setIsInspecting(false);
    setInspected(null);
  }, []);

  const onPointerMove = useCallback(
    e => {
      findViewForLocation(e.nativeEvent.x, e.nativeEvent.y);
    },
    [findViewForLocation],
  );

  const onResponderMove = useCallback(
    e => {
      findViewForLocation(
        e.nativeEvent.touches[0].locationX,
        e.nativeEvent.touches[0].locationY,
      );
    },
    [findViewForLocation],
  );

  const shouldSetResponser = useCallback(
    (e) => {
      onResponderMove(e);
      return true;
    },
    [onResponderMove],
  );

  let highlight = inspected ? <ElementBox frame={inspected.frame} /> : null;
  if (isInspecting) {
    const events = ReactNativeFeatureFlags.shouldEmitW3CPointerEvents
      ? {
          onPointerMove,
          onPointerDown: onPointerMove,
          onPointerUp: stopInspecting,
        }
      : {
          onStartShouldSetResponder: shouldSetResponser,
          onResponderMove: onResponderMove,
          onResponderRelease: stopInspecting,
        };
    return (
      <View
        nativeID="devToolsInspectorOverlay"
        style={[styles.inspector, {height: Dimensions.get('window').height}]}
        {...events}>
        {highlight}
      </View>
    );
  }
  return highlight;
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
