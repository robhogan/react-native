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

import SectionList from '../SectionList';
import * as React from 'react';

function renderMyListItem(info) {
  return <span />;
}

const renderMyHeader = ({
  section,
}) => <span />;

module.exports = {
  testGoodDataWithGoodItem() {
    const sections = [
      {
        key: 'a',
        data: [
          {
            title: 'foo',
            key: 1,
          },
        ],
      },
    ];
    return <SectionList renderItem={renderMyListItem} sections={sections} />;
  },

  testBadRenderItemFunction() {
    const sections = [
      {
        key: 'a',
        data: [
          {
            title: 'foo',
            key: 1,
          },
        ],
      },
    ];
    return [
      <SectionList
        // $FlowExpectedError - title should be inside `item`
        renderItem={(info) => <span />}
        sections={sections}
      />,
      <SectionList
        // $FlowExpectedError - bad index type string, should be number
        renderItem={(info) => <span />}
        sections={sections}
      />,
      // EverythingIsFine
      <SectionList
        renderItem={(info) => <span />}
        sections={sections}
      />,
    ];
  },

  testBadInheritedDefaultProp() {
    const sections = [];
    return (
      <SectionList
        renderItem={renderMyListItem}
        sections={sections}
        // $FlowExpectedError - bad windowSize type "big"
        windowSize="big"
      />
    );
  },

  testMissingData() {
    // $FlowExpectedError - missing `sections` prop
    return <SectionList renderItem={renderMyListItem} />;
  },

  testBadSectionsShape() {
    const sections = [
      {
        key: 'a',
        items: [
          {
            title: 'foo',
            key: 1,
          },
        ],
      },
    ];
    // $FlowExpectedError - section missing `data` field
    return <SectionList renderItem={renderMyListItem} sections={sections} />;
  },

  testBadSectionsMetadata() {
    const sections = [
      {
        key: 'a',
        fooNumber: 'string',
        data: [
          {
            title: 'foo',
            key: 1,
          },
        ],
      },
    ];
    return (
      <SectionList
        renderSectionHeader={renderMyHeader}
        renderItem={renderMyListItem}
        /* $FlowExpectedError - section has bad meta data `fooNumber` field of
         * type string */
        sections={sections}
      />
    );
  },
};
