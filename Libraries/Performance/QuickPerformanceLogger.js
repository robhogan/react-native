/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 *  strict
 */

'use strict';

const AUTO_SET_TIMESTAMP = -1;
const DUMMY_INSTANCE_KEY = 0;

// Defines map of annotations
// Use as following:
// {string: {key1: value1, key2: value2}}

const QuickPerformanceLogger = {
  markerStart(
    markerId,
    instanceKey = DUMMY_INSTANCE_KEY,
    timestamp = AUTO_SET_TIMESTAMP,
  ) {
    if (global.nativeQPLMarkerStart) {
      global.nativeQPLMarkerStart(markerId, instanceKey, timestamp);
    }
  },

  markerEnd(
    markerId,
    actionId,
    instanceKey = DUMMY_INSTANCE_KEY,
    timestamp = AUTO_SET_TIMESTAMP,
  ) {
    if (global.nativeQPLMarkerEnd) {
      global.nativeQPLMarkerEnd(markerId, instanceKey, actionId, timestamp);
    }
  },

  markerTag(
    markerId,
    tag,
    instanceKey = DUMMY_INSTANCE_KEY,
  ) {
    if (global.nativeQPLMarkerTag) {
      global.nativeQPLMarkerTag(markerId, instanceKey, tag);
    }
  },

  markerAnnotate(
    markerId,
    annotations,
    instanceKey = DUMMY_INSTANCE_KEY,
  ) {
    if (global.nativeQPLMarkerAnnotateWithMap) {
      global.nativeQPLMarkerAnnotateWithMap(markerId, annotations, instanceKey);
    } else if (global.nativeQPLMarkerAnnotate) {
      for (const type of [
        'string',
        'int',
        'double',
        'bool',
        'string_array',
        'int_array',
        'double_array',
        'bool_array',
      ]) {
        const keyValsOfType = annotations[type];
        if (keyValsOfType != null) {
          for (const annotationKey of Object.keys(keyValsOfType)) {
            global.nativeQPLMarkerAnnotate(
              markerId,
              instanceKey,
              annotationKey,
              keyValsOfType[annotationKey].toString(),
            );
          }
        }
      }
    }
  },

  markerCancel(
    markerId,
    instanceKey = DUMMY_INSTANCE_KEY,
  ) {
    // $FlowFixMe[object-this-reference]
    this.markerDrop(markerId, instanceKey);
  },

  markerPoint(
    markerId,
    name,
    instanceKey = DUMMY_INSTANCE_KEY,
    timestamp = AUTO_SET_TIMESTAMP,
    data = null,
  ) {
    if (global.nativeQPLMarkerPoint) {
      global.nativeQPLMarkerPoint(markerId, name, instanceKey, timestamp, data);
    }
  },

  markerDrop(
    markerId,
    instanceKey = DUMMY_INSTANCE_KEY,
  ) {
    if (global.nativeQPLMarkerDrop) {
      global.nativeQPLMarkerDrop(markerId, instanceKey);
    }
  },

  markEvent(
    markerId,
    type,
    annotations = null,
  ) {
    if (global.nativeQPLMarkEvent) {
      global.nativeQPLMarkEvent(markerId, type, annotations);
    }
  },

  currentTimestamp() {
    if (global.nativeQPLTimestamp) {
      return global.nativeQPLTimestamp();
    }
    return 0;
  },
};

module.exports = QuickPerformanceLogger;
