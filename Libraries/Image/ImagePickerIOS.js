/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 *  strict-local
 */

import NativeImagePickerIOS from './NativeImagePickerIOS';
import invariant from 'invariant';

const ImagePickerIOS = {
  canRecordVideos: function (callback) {
    invariant(NativeImagePickerIOS, 'ImagePickerIOS is not available');
    return NativeImagePickerIOS.canRecordVideos(callback);
  },
  canUseCamera: function (callback) {
    invariant(NativeImagePickerIOS, 'ImagePickerIOS is not available');
    return NativeImagePickerIOS.canUseCamera(callback);
  },
  openCameraDialog: function (
    config,
    successCallback,
    cancelCallback,
  ) {
    invariant(NativeImagePickerIOS, 'ImagePickerIOS is not available');

    var newConfig = {
      videoMode: true,
      unmirrorFrontFacingCamera: false,
    };

    if (config.videoMode != null) {
      newConfig.videoMode = config.videoMode;
    }

    if (config.unmirrorFrontFacingCamera != null) {
      newConfig.unmirrorFrontFacingCamera = config.unmirrorFrontFacingCamera;
    }

    return NativeImagePickerIOS.openCameraDialog(
      newConfig,
      successCallback,
      cancelCallback,
    );
  },
  openSelectDialog: function (
    config,
    successCallback,
    cancelCallback,
  ) {
    invariant(NativeImagePickerIOS, 'ImagePickerIOS is not available');

    var newConfig = {
      showImages: true,
      showVideos: false,
    };

    if (config.showImages != null) {
      newConfig.showImages = config.showImages;
    }

    if (config.showVideos != null) {
      newConfig.showVideos = config.showVideos;
    }

    return NativeImagePickerIOS.openSelectDialog(
      newConfig,
      successCallback,
      cancelCallback,
    );
  },
  /**
   * In iOS 13, the video URLs returned by the Image Picker are invalidated when
   * the picker is dismissed, unless reference to it is held. This API allows
   * the application to signal when it's finished with the video so that the
   * reference can be cleaned up.
   * It is safe to call this method for urlsthat aren't video URLs;
   * it will be a no-op.
   */
  removePendingVideo: function (url) {
    invariant(NativeImagePickerIOS, 'ImagePickerIOS is not available');
    NativeImagePickerIOS.removePendingVideo(url);
  },
  /**
   * WARNING: In most cases, removePendingVideo should be used instead because
   * clearAllPendingVideos could clear out pending videos made by other callers.
   */
  clearAllPendingVideos: function () {
    invariant(NativeImagePickerIOS, 'ImagePickerIOS is not available');
    NativeImagePickerIOS.clearAllPendingVideos();
  },
};

module.exports = ImagePickerIOS;
