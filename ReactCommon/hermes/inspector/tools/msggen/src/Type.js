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
import {jsTypeToCppType, toCppNamespace, toCppType} from './Converters';

export class Type {
  domain;
  id;
  description;
  exported;
  experimental;

  static create(domain, obj, ignoreExperimental) {
    let type = null;

    if (obj.type === 'object' && obj.properties) {
      type = new PropsType(domain, obj, ignoreExperimental);
    } else if (obj.type) {
      type = new PrimitiveType(domain, obj, ignoreExperimental);
    } else {
      throw new TypeError('Type requires `type` property.');
    }

    if (ignoreExperimental && type.experimental) {
      type = null;
    }

    return type;
  }

  constructor(domain, obj) {
    this.domain = domain;
    this.id = obj.id;
    this.description = obj.description;
    this.exported = obj.exported;
    this.experimental = obj.experimental;
  }

  getDebuggerName() {
    return `${this.domain}.${this.id}`;
  }

  getCppNamespace() {
    return toCppNamespace(this.domain);
  }

  getCppType() {
    return toCppType(this.id);
  }

  getForwardDecls() {
    throw new Error('subclass must implement');
  }

  getForwardDeclSortKey() {
    return this.getCppType();
  }
}

export class PrimitiveType extends Type {
  type;

  constructor(domain, obj, ignoreExperimental) {
    super(domain, obj);
    this.type = obj.type;
  }

  getForwardDecls() {
    return [`using ${this.getCppType()} = ${jsTypeToCppType(this.type)};`];
  }
}

export class PropsType extends Type {
  type;
  properties;

  constructor(domain, obj, ignoreExperimental) {
    super(domain, obj);
    this.type = obj.type;
    this.properties = Property.createArray(
      domain,
      obj.properties || [],
      ignoreExperimental,
    );
  }

  getForwardDecls() {
    return [`struct ${this.getCppType()};`];
  }
}
