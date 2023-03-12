/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */

'use strict';



const PixelRatio = require('../Utilities/PixelRatio');
const Platform = require('../Utilities/Platform');
const {pickScale} = require('./AssetUtils');
const {
  getAndroidResourceFolderName,
  getAndroidResourceIdentifier,
  getBasePath,
} = require('@react-native/assets/path-support');
const invariant = require('invariant');

/**
 * Returns a path like 'assets/AwesomeModule/icon@2x.png'
 */
function getScaledAssetPath(asset) {
  const scale = pickScale(asset.scales, PixelRatio.get());
  const scaleSuffix = scale === 1 ? '' : '@' + scale + 'x';
  const assetDir = getBasePath(asset);
  return assetDir + '/' + asset.name + scaleSuffix + '.' + asset.type;
}

/**
 * Returns a path like 'drawable-mdpi/icon.png'
 */
function getAssetPathInDrawableFolder(asset) {
  const scale = pickScale(asset.scales, PixelRatio.get());
  const drawableFolder = getAndroidResourceFolderName(asset, scale);
  const fileName = getAndroidResourceIdentifier(asset);
  return drawableFolder + '/' + fileName + '.' + asset.type;
}

class AssetSourceResolver {
  serverUrl;
  // where the jsbundle is being run from
  jsbundleUrl;
  // the asset to resolve
  asset;

  constructor(serverUrl, jsbundleUrl, asset) {
    this.serverUrl = serverUrl;
    this.jsbundleUrl = jsbundleUrl;
    this.asset = asset;
  }

  isLoadedFromServer() {
    return !!this.serverUrl;
  }

  isLoadedFromFileSystem() {
    return !!(this.jsbundleUrl && this.jsbundleUrl.startsWith('file://'));
  }

  defaultAsset() {
    if (this.isLoadedFromServer()) {
      return this.assetServerURL();
    }

    if (Platform.OS === 'android') {
      return this.isLoadedFromFileSystem()
        ? this.drawableFolderInBundle()
        : this.resourceIdentifierWithoutScale();
    } else {
      return this.scaledAssetURLNearBundle();
    }
  }

  /**
   * Returns an absolute URL which can be used to fetch the asset
   * from the devserver
   */
  assetServerURL() {
    invariant(!!this.serverUrl, 'need server to load from');
    return this.fromSource(
      this.serverUrl +
        getScaledAssetPath(this.asset) +
        '?platform=' +
        Platform.OS +
        '&hash=' +
        this.asset.hash,
    );
  }

  /**
   * Resolves to just the scaled asset filename
   * E.g. 'assets/AwesomeModule/icon@2x.png'
   */
  scaledAssetPath() {
    return this.fromSource(getScaledAssetPath(this.asset));
  }

  /**
   * Resolves to where the bundle is running from, with a scaled asset filename
   * E.g. 'file:///sdcard/bundle/assets/AwesomeModule/icon@2x.png'
   */
  scaledAssetURLNearBundle() {
    const path = this.jsbundleUrl || 'file://';
    return this.fromSource(
      // Assets can have relative paths outside of the project root.
      // When bundling them we replace `../` with `_` to make sure they
      // don't end up outside of the expected assets directory.
      path + getScaledAssetPath(this.asset).replace(/\.\.\//g, '_'),
    );
  }

  /**
   * The default location of assets bundled with the app, located by
   * resource identifier
   * The Android resource system picks the correct scale.
   * E.g. 'assets_awesomemodule_icon'
   */
  resourceIdentifierWithoutScale() {
    invariant(
      Platform.OS === 'android',
      'resource identifiers work on Android',
    );
    return this.fromSource(getAndroidResourceIdentifier(this.asset));
  }

  /**
   * If the jsbundle is running from a sideload location, this resolves assets
   * relative to its location
   * E.g. 'file:///sdcard/AwesomeModule/drawable-mdpi/icon.png'
   */
  drawableFolderInBundle() {
    const path = this.jsbundleUrl || 'file://';
    return this.fromSource(path + getAssetPathInDrawableFolder(this.asset));
  }

  fromSource(source) {
    return {
      __packager_asset: true,
      width: this.asset.width,
      height: this.asset.height,
      uri: source,
      scale: pickScale(this.asset.scales, PixelRatio.get()),
    };
  }

  static pickScale =
    pickScale;
}

module.exports = AssetSourceResolver;
