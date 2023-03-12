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

export class Command {
  domain;
  name;
  description;
  experimental;
  parameters;
  returns;

  static create(
    domain,
    obj,
    ignoreExperimental,
  ) {
    return ignoreExperimental && obj.experimental
      ? null
      : new Command(domain, obj, ignoreExperimental);
  }

  constructor(domain, obj, ignoreExperimental) {
    this.domain = domain;
    this.name = obj.name;
    this.description = obj.description;
    this.experimental = obj.experimental;
    this.parameters = Property.createArray(
      domain,
      obj.parameters || [],
      ignoreExperimental,
    );
    this.returns = Property.createArray(
      domain,
      obj.returns || [],
      ignoreExperimental,
    );
  }

  getDebuggerName() {
    return `${this.domain}.${this.name}`;
  }

  getCppNamespace() {
    return toCppNamespace(this.domain);
  }

  getRequestCppType() {
    return toCppType(this.name + 'Request');
  }

  getResponseCppType() {
    if (this.returns && this.returns.length > 0) {
      return toCppType(this.name + 'Response');
    }
  }

  getForwardDecls() {
    const decls = [`struct ${this.getRequestCppType()};`];
    const respCppType = this.getResponseCppType();
    if (respCppType) {
      decls.push(`struct ${respCppType};`);
    }
    return decls;
  }

  getForwardDeclSortKey() {
    return this.getRequestCppType();
  }
}
