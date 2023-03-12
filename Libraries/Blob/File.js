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

const Blob = require('./Blob');

const invariant = require('invariant');


/**
 * The File interface provides information about files.
 */
class File extends Blob {
  /**
   * Constructor for JS consumers.
   */
  constructor(
    parts,
    name,
    options,
  ) {
    invariant(
      parts != null && name != null,
      'Failed to construct `File`: Must pass both `parts` and `name` arguments.',
    );

    super(parts, options);
    this.data.name = name;
  }

  /**
   * Name of the file.
   */
  get name() {
    invariant(this.data.name != null, 'Files must have a name set.');
    return this.data.name;
  }

  /*
   * Last modified time of the file.
   */
  get lastModified() {
    return this.data.lastModified || 0;
  }
}

module.exports = File;
