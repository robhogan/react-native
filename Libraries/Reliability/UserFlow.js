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

const AUTO_INSTANCE_KEY = -1;



/**
 * API for tracking reliability of your user interactions
 *
 * Example:
 * const flowId = UserFlow.newFlowId(QuickLogItentifiersExample.EXAMPLE_EVENT);
 * ...
 * UserFlow.start(flowId, {triggerSource: "user_click", cancelOnBackground: true});
 * ...
 * UserFlow.addAnnotation(flowId, "cached", "true");
 * ...
 * UserFlow.addPoint(flowId, "reload");
 * ...
 * UserFlow.endSuccess(flowId);
 */
const UserFlow = {
  /**
   * Creates FlowId from markerId and instanceKey.
   * You will pass FlowId in every other method of UserFlow API.
   *
   * By default, instanceKey will generate unique instance every time you call userFlowGetId with markerId only.
   */
  newFlowId(markerId, instanceKey = AUTO_INSTANCE_KEY) {
    var resolvedInstanceKey = instanceKey;
    if (instanceKey === AUTO_INSTANCE_KEY) {
      if (global.nativeUserFlowNextInstanceKey) {
        resolvedInstanceKey = global.nativeUserFlowNextInstanceKey(markerId);
      } else {
        // There is no JSI methods installed, API won't do anything
        resolvedInstanceKey = 0;
      }
    }
    return {
      markerId: markerId,
      instanceKey: resolvedInstanceKey,
    };
  },

  /**
   * Starts new flow.
   * Example:
   * UserFlow.start(flowId, {triggerSource: 'user_click', cancelOnBackground: true})
   *
   * Specify triggerSource as a place where your flow has started.
   * Specify if flow should be automatically cancelled if applicaton goes to background.
   * It is recommended to use true for cancelOnBackground - this reduces amount of lost flows due to instrumentation mistakes.
   * Only if you know that your flow should survive app backgrounding - use false. This includes cases of tracking cross application interactions.
   *
   */
  start(
    flowId,
    options,
  ) {
    if (global.nativeUserFlowStart) {
      global.nativeUserFlowStart(
        flowId.markerId,
        flowId.instanceKey,
        options.triggerSource,
        options.cancelOnBackground,
      );
    }
  },

  addAnnotation(
    flowId,
    annotationName,
    annotationValue,
  ) {
    if (global.nativeUserFlowAddAnnotation) {
      global.nativeUserFlowAddAnnotation(
        flowId.markerId,
        flowId.instanceKey,
        annotationName,
        annotationValue,
      );
    }
  },

  addPoint(flowId, pointName, data = null) {
    if (global.nativeUserFlowAddPoint) {
      global.nativeUserFlowAddPoint(
        flowId.markerId,
        flowId.instanceKey,
        pointName,
        data,
      );
    }
  },

  endSuccess(flowId) {
    if (global.nativeUserFlowEndSuccess) {
      global.nativeUserFlowEndSuccess(flowId.markerId, flowId.instanceKey);
    }
  },

  /**
   * Completes flow as failed
   *
   * ErrorName should be short and easily categorazable (it is attached as point to the UserFlow and can be used for aggregations).
   * For example: io_error, network_error, parse_error, validation_error.
   * DebugInfo is free-form string, where you can attach detailed error message. It is attached as data to the point (see ErrorName).
   */
  endFailure(
    flowId,
    errorName,
    debugInfo = null,
  ) {
    if (global.nativeUserFlowEndFail) {
      global.nativeUserFlowEndFail(
        flowId.markerId,
        flowId.instanceKey,
        errorName,
        debugInfo,
      );
    }
  },

  endCancel(flowId, cancelReason) {
    if (global.nativeUserFlowEndCancel) {
      global.nativeUserFlowEndCancel(
        flowId.markerId,
        flowId.instanceKey,
        cancelReason,
      );
    }
  },
};

module.exports = UserFlow;
