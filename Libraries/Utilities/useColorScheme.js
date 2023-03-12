/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 *  strict-local
 */

'use strict';

import {useSyncExternalStore} from 'use-sync-external-store/shim';
import Appearance from './Appearance';

export default function useColorScheme() {
  return useSyncExternalStore(
    callback => {
      const appearanceSubscription = Appearance.addChangeListener(callback);
      return () => appearanceSubscription.remove();
    },
    () => Appearance.getColorScheme(),
  );
}
