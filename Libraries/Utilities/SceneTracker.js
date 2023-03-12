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


let _listeners = [];

let _activeScene = {name: 'default'};

const SceneTracker = {
  setActiveScene(scene) {
    _activeScene = scene;
    _listeners.forEach(listener => listener(_activeScene));
  },

  getActiveScene() {
    return _activeScene;
  },

  addActiveSceneChangedListener(callback) {
    _listeners.push(callback);
    return {
      remove: () => {
        _listeners = _listeners.filter(listener => callback !== listener);
      },
    };
  },
};

module.exports = SceneTracker;
