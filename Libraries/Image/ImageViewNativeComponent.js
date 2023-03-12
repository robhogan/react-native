/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *  strict-local
 * @format
 */

import * as NativeComponentRegistry from '../NativeComponent/NativeComponentRegistry';
import {ConditionallyIgnoredEventHandlers} from '../NativeComponent/ViewConfigIgnore';
import Platform from '../Utilities/Platform';


export const __INTERNAL_VIEW_CONFIG =
  Platform.OS === 'android'
    ? {
        uiViewClassName: 'RCTImageView',
        bubblingEventTypes: {},
        directEventTypes: {
          topLoadStart: {
            registrationName: 'onLoadStart',
          },
          topProgress: {
            registrationName: 'onProgress',
          },
          topError: {
            registrationName: 'onError',
          },
          topLoad: {
            registrationName: 'onLoad',
          },
          topLoadEnd: {
            registrationName: 'onLoadEnd',
          },
        },
        validAttributes: {
          blurRadius: true,
          internal_analyticTag: true,
          resizeMode: true,
          tintColor: {
            process: require('../StyleSheet/processColor'),
          },
          borderBottomLeftRadius: true,
          borderTopLeftRadius: true,
          resizeMethod: true,
          src: true,
          borderRadius: true,
          headers: true,
          shouldNotifyLoadEvents: true,
          defaultSrc: true,
          overlayColor: {
            process: require('../StyleSheet/processColor'),
          },
          borderColor: {
            process: require('../StyleSheet/processColor'),
          },
          accessible: true,
          progressiveRenderingEnabled: true,
          fadeDuration: true,
          borderBottomRightRadius: true,
          borderTopRightRadius: true,
          loadingIndicatorSrc: true,
        },
      }
    : {
        uiViewClassName: 'RCTImageView',
        bubblingEventTypes: {},
        directEventTypes: {
          topLoadStart: {
            registrationName: 'onLoadStart',
          },
          topProgress: {
            registrationName: 'onProgress',
          },
          topError: {
            registrationName: 'onError',
          },
          topPartialLoad: {
            registrationName: 'onPartialLoad',
          },
          topLoad: {
            registrationName: 'onLoad',
          },
          topLoadEnd: {
            registrationName: 'onLoadEnd',
          },
        },
        validAttributes: {
          blurRadius: true,
          capInsets: {
            diff: require('../Utilities/differ/insetsDiffer'),
          },
          defaultSource: {
            process: require('./resolveAssetSource'),
          },
          internal_analyticTag: true,
          resizeMode: true,
          source: true,
          tintColor: {
            process: require('../StyleSheet/processColor'),
          },
          ...ConditionallyIgnoredEventHandlers({
            onLoadStart: true,
            onLoad: true,
            onLoadEnd: true,
            onProgress: true,
            onError: true,
            onPartialLoad: true,
          }),
        },
      };

const ImageViewNativeComponent =
  NativeComponentRegistry.get(
    'RCTImageView',
    () => __INTERNAL_VIEW_CONFIG,
  );

export default ImageViewNativeComponent;
