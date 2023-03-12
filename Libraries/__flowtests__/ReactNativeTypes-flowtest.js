/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */


import * as React from 'react';

function takesHostComponentInstance(
  instance,
) {}

const MyHostComponent = (('Host'));

<MyHostComponent
  ref={hostComponentRef => {
    takesHostComponentInstance(hostComponentRef);

    if (hostComponentRef == null) {
      return;
    }

    hostComponentRef.measureLayout(hostComponentRef, () => {});
  }}
/>;
