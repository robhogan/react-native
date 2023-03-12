/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *  strict-local
 * @format
 */

import * as React from 'react';
import {useMemo, useContext} from 'react';



// Data propagated through nested lists (regardless of orientation) that is
// useful for producing diagnostics for usage errors involving nesting (e.g
// missing/duplicate keys).


export const VirtualizedListContext =
  React.createContext(null);
if (__DEV__) {
  VirtualizedListContext.displayName = 'VirtualizedListContext';
}

/**
 * Resets the context. Intended for use by portal-like components (e.g. Modal).
 */
export function VirtualizedListContextResetter({
  children,
}) {
  return (
    <VirtualizedListContext.Provider value={null}>
      {children}
    </VirtualizedListContext.Provider>
  );
}

/**
 * Sets the context with memoization. Intended to be used by `VirtualizedList`.
 */
export function VirtualizedListContextProvider({
  children,
  value,
}) {
  // Avoid setting a newly created context object if the values are identical.
  const context = useMemo(
    () => ({
      cellKey: null,
      getScrollMetrics: value.getScrollMetrics,
      horizontal: value.horizontal,
      getOutermostParentListRef: value.getOutermostParentListRef,
      getNestedChildState: value.getNestedChildState,
      registerAsNestedChild: value.registerAsNestedChild,
      unregisterAsNestedChild: value.unregisterAsNestedChild,
      debugInfo: {
        cellKey: value.debugInfo.cellKey,
        horizontal: value.debugInfo.horizontal,
        listKey: value.debugInfo.listKey,
        parent: value.debugInfo.parent,
      },
    }),
    [
      value.getScrollMetrics,
      value.horizontal,
      value.getOutermostParentListRef,
      value.getNestedChildState,
      value.registerAsNestedChild,
      value.unregisterAsNestedChild,
      value.debugInfo.cellKey,
      value.debugInfo.horizontal,
      value.debugInfo.listKey,
      value.debugInfo.parent,
    ],
  );
  return (
    <VirtualizedListContext.Provider value={context}>
      {children}
    </VirtualizedListContext.Provider>
  );
}

/**
 * Sets the `cellKey`. Intended to be used by `VirtualizedList` for each cell.
 */
export function VirtualizedListCellContextProvider({
  cellKey,
  children,
}) {
  // Avoid setting a newly created context object if the values are identical.
  const currContext = useContext(VirtualizedListContext);
  const context = useMemo(
    () => (currContext == null ? null : {...currContext, cellKey}),
    [currContext, cellKey],
  );
  return (
    <VirtualizedListContext.Provider value={context}>
      {children}
    </VirtualizedListContext.Provider>
  );
}
