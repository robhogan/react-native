/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */

import {
  jsTypeToCppType,
  toCppNamespace,
  toCppType,
} from './Converters';

export class Property {
  domain;
  name;
  description;
  exported;
  experimental;
  optional;

  static create(domain, obj) {
    if (obj.$ref) {
      return new RefProperty(domain, obj);
    } else if (obj.type === 'array') {
      return new ArrayProperty(domain, obj);
    }
    return new PrimitiveProperty(domain, obj);
  }

  static createArray(
    domain,
    elements,
    ignoreExperimental,
  ) {
    let props = elements.map(elem => Property.create(domain, elem));
    if (ignoreExperimental) {
      props = props.filter(prop => !prop.experimental);
    }
    return props;
  }

  constructor(domain, obj) {
    this.domain = domain;
    this.name = obj.name;
    this.description = obj.description;
    this.exported = obj.exported;
    this.experimental = obj.experimental;
    this.optional = obj.optional;
  }

  getRefDebuggerName() {
    throw new Error('subclass must implement');
  }

  getFullCppType() {
    throw new Error('subclass must implement');
  }

  getCppIdentifier() {
    // need to munge identifier if it matches a C++ keyword like "this"
    if (this.name === 'this') {
      return 'thisObj';
    }
    return this.name;
  }

  getInitializer() {
    throw new Error('subclass must implement');
  }
}

function maybeWrapOptional(
  type,
  optional,
  recursive,
) {
  if (optional) {
    return recursive ? `std::unique_ptr<${type}>` : `folly::Optional<${type}>`;
  }
  return type;
}

function toDomainAndId(
  curDomain,
  absOrRelRef,
) {
  let [domain, id] = ['', ''];

  // absOrRelRef can be:
  // 1) absolute ref with a "." referencing a type from another namespace, like
  //    "Runtime.ExceptionDetails"
  // 2) relative ref without a "." referencing a type in current domain, like
  //    "Domain"
  const i = absOrRelRef.indexOf('.');
  if (i === -1) {
    domain = curDomain;
    id = absOrRelRef;
  } else {
    domain = absOrRelRef.substr(0, i);
    id = absOrRelRef.substr(i + 1);
  }

  return [domain, id];
}

function toFullCppType(curDomain, absOrRelRef) {
  const [domain, id] = toDomainAndId(curDomain, absOrRelRef);
  return `${toCppNamespace(domain)}::${toCppType(id)}`;
}

class PrimitiveProperty extends Property {
  type;

  constructor(domain, obj) {
    super(domain, obj);
    this.type = obj.type;
  }

  getRefDebuggerName() {
    return undefined;
  }

  getFullCppType() {
    return maybeWrapOptional(jsTypeToCppType(this.type), this.optional);
  }

  getInitializer() {
    // folly::Optional doesn't need to be explicitly zero-init
    if (this.optional) {
      return '';
    }

    // we want to explicitly zero-init bool, int, and double
    const type = this.type;
    if (type === 'boolean' || type === 'integer' || type === 'number') {
      return '{}';
    }

    // everything else (folly::dynamic and std::string) has sensible default
    // constructor, no need to explicitly zero-init
    return '';
  }
}

class RefProperty extends Property {
  $ref;
  recursive;

  constructor(domain, obj) {
    super(domain, obj);
    this.$ref = obj.$ref;
    this.recursive = obj.recursive;
  }

  getRefDebuggerName() {
    const [domain, id] = toDomainAndId(this.domain, this.$ref);
    return `${domain}.${id}`;
  }

  getFullCppType() {
    const fullCppType = toFullCppType(this.domain, this.$ref);
    return maybeWrapOptional(`${fullCppType}`, this.optional, this.recursive);
  }

  getInitializer() {
    // must zero-init non-optional ref props since the ref could just be an
    // alias to a C++ primitive type like int which we always want to zero-init
    return this.optional ? '' : '{}';
  }
}

class ArrayProperty extends Property {
  type;
  items;

  constructor(domain, obj) {
    super(domain, obj);
    this.type = obj.type;
    this.items = obj.items;
  }

  getRefDebuggerName() {
    if (this.items && this.items.$ref && !this.items.recursive) {
      const [domain, id] = toDomainAndId(this.domain, this.items.$ref);
      return `${domain}.${id}`;
    }
  }

  getFullCppType() {
    let elemType = 'folly::dynamic';
    let recursive = false;

    if (this.items) {
      if (this.items.type) {
        elemType = jsTypeToCppType(this.items.type);
      } else if (this.items.$ref) {
        elemType = toFullCppType(this.domain, this.items.$ref);
        recursive = this.items.recursive;
      }
    }

    return maybeWrapOptional(
      `std::vector<${elemType}>`,
      this.optional,
      recursive,
    );
  }

  getInitializer() {
    return '';
  }
}
