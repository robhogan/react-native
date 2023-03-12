/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *  strict-local
 * @format
 */

export function toCppNamespace(domain) {
  return domain.substr(0, 1).toLowerCase() + domain.substr(1);
}

export function toCppType(type) {
  return type.substr(0, 1).toUpperCase() + type.substr(1);
}


const jsTypeMappings = {
  any: 'folly::dynamic',
  array: 'folly::dynamic',
  boolean: 'bool',
  integer: 'int',
  number: 'double',
  object: 'folly::dynamic',
  string: 'std::string',
};

export function jsTypeToCppType(jsTypeStr) {
  return jsTypeMappings[jsTypeStr];
}
