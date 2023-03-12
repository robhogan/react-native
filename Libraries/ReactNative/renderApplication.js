/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 */

const AppContainer = require('./AppContainer');
import GlobalPerformanceLogger from '../Utilities/GlobalPerformanceLogger';
import PerformanceLoggerContext from '../Utilities/PerformanceLoggerContext';
import getCachedComponentWithDebugName from './getCachedComponentWithDebugName';
const React = require('react');

const invariant = require('invariant');

// require BackHandler so it sets the default handler that exits the app if no listeners respond
require('../Utilities/BackHandler');

function renderApplication(
  RootComponent,
  initialProps,
  rootTag,
  WrapperComponent,
  fabric,
  showArchitectureIndicator,
  scopedPerformanceLogger,
  isLogBox,
  debugName,
  displayMode,
  useConcurrentRoot,
) {
  invariant(rootTag, 'Expect to have a valid rootTag, instead got ', rootTag);

  const performanceLogger = scopedPerformanceLogger ?? GlobalPerformanceLogger;

  let renderable = (
    <PerformanceLoggerContext.Provider value={performanceLogger}>
      <AppContainer
        rootTag={rootTag}
        fabric={fabric}
        showArchitectureIndicator={showArchitectureIndicator}
        WrapperComponent={WrapperComponent}
        initialProps={initialProps ?? Object.freeze({})}
        internal_excludeLogBox={isLogBox}>
        <RootComponent {...initialProps} rootTag={rootTag} />
      </AppContainer>
    </PerformanceLoggerContext.Provider>
  );

  if (__DEV__ && debugName) {
    const RootComponentWithMeaningfulName = getCachedComponentWithDebugName(
      `${debugName}(RootComponent)`,
    );
    renderable = (
      <RootComponentWithMeaningfulName>
        {renderable}
      </RootComponentWithMeaningfulName>
    );
  }

  performanceLogger.startTimespan('renderApplication_React_render');
  performanceLogger.setExtra(
    'usedReactConcurrentRoot',
    useConcurrentRoot ? '1' : '0',
  );
  performanceLogger.setExtra('usedReactFabric', fabric ? '1' : '0');
  if (fabric) {
    require('../Renderer/shims/ReactFabric').render(
      renderable,
      rootTag,
      null,
      useConcurrentRoot,
    );
  } else {
    require('../Renderer/shims/ReactNative').render(renderable, rootTag);
  }
  performanceLogger.stopTimespan('renderApplication_React_render');
}

module.exports = renderApplication;
