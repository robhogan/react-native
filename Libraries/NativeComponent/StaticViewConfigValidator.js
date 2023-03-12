/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *  strict
 * @format
 */

import {} from '../Renderer/shims/ReactNativeTypes';
import {isIgnored} from './ViewConfigIgnore';



/**
 * During the migration from native view configs to static view configs, this is
 * used to validate that the two are equivalent.
 */
export function validate(
  name,
  nativeViewConfig,
  staticViewConfig,
) {
  const differences = [];
  accumulateDifferences(
    differences,
    [],
    {
      bubblingEventTypes: nativeViewConfig.bubblingEventTypes,
      directEventTypes: nativeViewConfig.directEventTypes,
      uiViewClassName: nativeViewConfig.uiViewClassName,
      validAttributes: nativeViewConfig.validAttributes,
    },
    {
      bubblingEventTypes: staticViewConfig.bubblingEventTypes,
      directEventTypes: staticViewConfig.directEventTypes,
      uiViewClassName: staticViewConfig.uiViewClassName,
      validAttributes: staticViewConfig.validAttributes,
    },
  );

  if (differences.length === 0) {
    return {type: 'valid'};
  }

  return {
    type: 'invalid',
    differences,
  };
}

export function stringifyValidationResult(
  name,
  validationResult,
) {
  const {differences} = validationResult;
  return [
    `StaticViewConfigValidator: Invalid static view config for '${name}'.`,
    '',
    ...differences.map(difference => {
      const {type, path} = difference;
      switch (type) {
        case 'missing':
          return `- '${path.join('.')}' is missing.`;
        case 'unequal':
          return `- '${path.join('.')}' is the wrong value.`;
        case 'unexpected':
          return `- '${path.join('.')}' is present but not expected to be.`;
      }
    }),
    '',
  ].join('\n');
}

function accumulateDifferences(
  differences,
  path,
  nativeObject,
  staticObject,
) {
  for (const nativeKey in nativeObject) {
    const nativeValue = nativeObject[nativeKey];

    if (!staticObject.hasOwnProperty(nativeKey)) {
      differences.push({
        path: [...path, nativeKey],
        type: 'missing',
        nativeValue,
      });
      continue;
    }

    const staticValue = staticObject[nativeKey];

    const nativeValueIfObject = ifObject(nativeValue);
    if (nativeValueIfObject != null) {
      const staticValueIfObject = ifObject(staticValue);
      if (staticValueIfObject != null) {
        path.push(nativeKey);
        accumulateDifferences(
          differences,
          path,
          nativeValueIfObject,
          staticValueIfObject,
        );
        path.pop();
        continue;
      }
    }

    if (nativeValue !== staticValue) {
      differences.push({
        path: [...path, nativeKey],
        type: 'unequal',
        nativeValue,
        staticValue,
      });
    }
  }

  for (const staticKey in staticObject) {
    if (
      !nativeObject.hasOwnProperty(staticKey) &&
      !isIgnored(staticObject[staticKey])
    ) {
      differences.push({
        path: [...path, staticKey],
        type: 'unexpected',
        staticValue: staticObject[staticKey],
      });
    }
  }
}

function ifObject(value) {
  return typeof value === 'object' && !Array.isArray(value) ? value : null;
}
