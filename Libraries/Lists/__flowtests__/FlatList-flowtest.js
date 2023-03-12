/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *  strict-local
 * @format
 */

'use strict';

const FlatList = require('../FlatList');
const React = require('react');

function renderMyListItem(info) {
  return <span />;
}

module.exports = {
  testEverythingIsFine() {
    const data = [
      {
        title: 'Title Text',
        key: 1,
      },
    ];
    return <FlatList renderItem={renderMyListItem} data={data} />;
  },

  testBadDataWithTypicalItem() {
    const data = [
      {
        title: 6,
        key: 1,
      },
    ];
    // $FlowExpectedError - bad title type 6, should be string
    return <FlatList renderItem={renderMyListItem} data={data} />;
  },

  testMissingFieldWithTypicalItem() {
    const data = [
      {
        key: 1,
      },
    ];
    // $FlowExpectedError - missing title
    return <FlatList renderItem={renderMyListItem} data={data} />;
  },

  testGoodDataWithBadCustomRenderItemFunction() {
    const data = [
      {
        widget: 6,
        key: 1,
      },
    ];
    return (
      <FlatList
        renderItem={info => (
          <span>
            {
              // $FlowExpectedError - bad widgetCount type 6, should be Object
              info.item.widget.missingProp
            }
          </span>
        )}
        data={data}
      />
    );
  },

  testBadRenderItemFunction() {
    const data = [
      {
        title: 'foo',
        key: 1,
      },
    ];
    return [
      // $FlowExpectedError - title should be inside `item`
      <FlatList renderItem={(info) => <span />} data={data} />,
      <FlatList
        // $FlowExpectedError - bad index type string, should be number
        renderItem={(info) => <span />}
        data={data}
      />,
      <FlatList
        // $FlowExpectedError - bad title type number, should be string
        renderItem={(info) => <span />}
        data={data}
      />,
      // EverythingIsFine
      <FlatList
        // $FlowExpectedError - bad title type number, should be string
        renderItem={(info) => <span />}
        data={data}
      />,
    ];
  },

  testOtherBadProps() {
    return [
      // $FlowExpectedError - bad numColumns type "lots"
      <FlatList renderItem={renderMyListItem} data={[]} numColumns="lots" />,
      // $FlowExpectedError - bad windowSize type "big"
      <FlatList renderItem={renderMyListItem} data={[]} windowSize="big" />,
      // $FlowExpectedError - missing `data` prop
      <FlatList renderItem={renderMyListItem} />,
    ];
  },
};
