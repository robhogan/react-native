/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *  strict-local
 * @format
 */

'use strict';


/**
 * Set up SegmentFetcher.
 * You can use this module directly, or just require InitializeCore.
 */

function __fetchSegment(
  segmentId,
  options,
  callback,
) {
  const SegmentFetcher =
    require('./SegmentFetcher/NativeSegmentFetcher').default;
  SegmentFetcher.fetchSegment(
    segmentId,
    options,
    (
      errorObject,
    ) => {
      if (errorObject) {
        const error = new Error(errorObject.message);
        (error).code = errorObject.code; // flowlint-line unclear-type: off
        callback(error);
      }

      callback(null);
    },
  );
}

global.__fetchSegment = __fetchSegment;

function __getSegment(
  segmentId,
  options,
  callback,
) {
  const SegmentFetcher =
    require('./SegmentFetcher/NativeSegmentFetcher').default;

  if (!SegmentFetcher.getSegment) {
    throw new Error('SegmentFetcher.getSegment must be defined');
  }

  SegmentFetcher.getSegment(
    segmentId,
    options,
    (
      errorObject,
      path,
    ) => {
      if (errorObject) {
        const error = new Error(errorObject.message);
        (error).code = errorObject.code; // flowlint-line unclear-type: off
        callback(error);
      }

      callback(null, path);
    },
  );
}

global.__getSegment = __getSegment;
