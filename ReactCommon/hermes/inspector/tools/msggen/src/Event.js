/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */

import {Property} from './Property';
import {toCppNamespace, toCppType} from './Converters';

export class Event {
  domain;
  name;
  description;
  experimental;
  parameters;

  static create(domain, obj, ignoreExperimental) {
    return ignoreExperimental && obj.experimental
      ? null
      : new Event(domain, obj, ignoreExperimental);
  }

  constructor(domain, obj, ignoreExperimental) {
    this.domain = domain;
    this.name = obj.name;
    this.description = obj.description;
    this.parameters = Property.createArray(
      domain,
      obj.parameters || [],
      ignoreExperimental,
    );
  }

  getDebuggerName() {
    return `${this.domain}.${this.name}`;
  }

  getCppNamespace() {
    return toCppNamespace(this.domain);
  }

  getCppType() {
    return toCppType(this.name + 'Notification');
  }

  getForwardDecls() {
    return [`struct ${this.getCppType()};`];
  }

  getForwardDeclSortKey() {
    return this.getCppType();
  }
}
