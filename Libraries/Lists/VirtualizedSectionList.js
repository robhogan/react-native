/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */


import View from '../Components/View/View';
import VirtualizedList from './VirtualizedList';
import {keyExtractor as defaultKeyExtractor} from './VirtualizeUtils';
import invariant from 'invariant';
import * as React from 'react';








/**
 * Right now this just flattens everything into one list and uses VirtualizedList under the
 * hood. The only operation that might not scale well is concatting the data arrays of all the
 * sections when new props are received, which should be plenty fast for up to ~10,000 items.
 */
class VirtualizedSectionList extends React.PureComponent {
  scrollToLocation(params) {
    let index = params.itemIndex;
    for (let i = 0; i < params.sectionIndex; i++) {
      index += this.props.getItemCount(this.props.sections[i].data) + 2;
    }
    let viewOffset = params.viewOffset || 0;
    if (this._listRef == null) {
      return;
    }
    if (params.itemIndex > 0 && this.props.stickySectionHeadersEnabled) {
      const frame = this._listRef.__getFrameMetricsApprox(
        index - params.itemIndex,
        this._listRef.props,
      );
      viewOffset += frame.length;
    }
    const toIndexParams = {
      ...params,
      viewOffset,
      index,
    };
    // $FlowFixMe[incompatible-use]
    this._listRef.scrollToIndex(toIndexParams);
  }

  getListRef() {
    return this._listRef;
  }

  render() {
    const {
      ItemSeparatorComponent, // don't pass through, rendered with renderItem
      SectionSeparatorComponent,
      renderItem: _renderItem,
      renderSectionFooter,
      renderSectionHeader,
      sections: _sections,
      stickySectionHeadersEnabled,
      ...passThroughProps
    } = this.props;

    const listHeaderOffset = this.props.ListHeaderComponent ? 1 : 0;

    const stickyHeaderIndices = this.props.stickySectionHeadersEnabled
      ? ([])
      : undefined;

    let itemCount = 0;
    for (const section of this.props.sections) {
      // Track the section header indices
      if (stickyHeaderIndices != null) {
        stickyHeaderIndices.push(itemCount + listHeaderOffset);
      }

      // Add two for the section header and footer.
      itemCount += 2;
      itemCount += this.props.getItemCount(section.data);
    }
    const renderItem = this._renderItem(itemCount);

    return (
      <VirtualizedList
        {...passThroughProps}
        keyExtractor={this._keyExtractor}
        stickyHeaderIndices={stickyHeaderIndices}
        renderItem={renderItem}
        data={this.props.sections}
        getItem={(sections, index) =>
          this._getItem(this.props, sections, index)
        }
        getItemCount={() => itemCount}
        onViewableItemsChanged={
          this.props.onViewableItemsChanged
            ? this._onViewableItemsChanged
            : undefined
        }
        ref={this._captureRef}
      />
    );
  }

  _getItem(
    props,
    sections,
    index,
  ) {
    if (!sections) {
      return null;
    }
    let itemIdx = index - 1;
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const sectionData = section.data;
      const itemCount = props.getItemCount(sectionData);
      if (itemIdx === -1 || itemIdx === itemCount) {
        // We intend for there to be overflow by one on both ends of the list.
        // This will be for headers and footers. When returning a header or footer
        // item the section itself is the item.
        return section;
      } else if (itemIdx < itemCount) {
        // If we are in the bounds of the list's data then return the item.
        return props.getItem(sectionData, itemIdx);
      } else {
        itemIdx -= itemCount + 2; // Add two for the header and footer
      }
    }
    return null;
  }

  // $FlowFixMe[missing-local-annot]
  _keyExtractor = (item, index) => {
    const info = this._subExtractor(index);
    return (info && info.key) || String(index);
  };

  _subExtractor(index) {
    let itemIndex = index;
    const {getItem, getItemCount, keyExtractor, sections} = this.props;
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const sectionData = section.data;
      const key = section.key || String(i);
      itemIndex -= 1; // The section adds an item for the header
      if (itemIndex >= getItemCount(sectionData) + 1) {
        itemIndex -= getItemCount(sectionData) + 1; // The section adds an item for the footer.
      } else if (itemIndex === -1) {
        return {
          section,
          key: key + ':header',
          index: null,
          header: true,
          trailingSection: sections[i + 1],
        };
      } else if (itemIndex === getItemCount(sectionData)) {
        return {
          section,
          key: key + ':footer',
          index: null,
          header: false,
          trailingSection: sections[i + 1],
        };
      } else {
        const extractor =
          section.keyExtractor || keyExtractor || defaultKeyExtractor;
        return {
          section,
          key:
            key + ':' + extractor(getItem(sectionData, itemIndex), itemIndex),
          index: itemIndex,
          leadingItem: getItem(sectionData, itemIndex - 1),
          leadingSection: sections[i - 1],
          trailingItem: getItem(sectionData, itemIndex + 1),
          trailingSection: sections[i + 1],
        };
      }
    }
  }

  _convertViewable = (viewable) => {
    invariant(viewable.index != null, 'Received a broken ViewToken');
    const info = this._subExtractor(viewable.index);
    if (!info) {
      return null;
    }
    const keyExtractorWithNullableIndex = info.section.keyExtractor;
    const keyExtractorWithNonNullableIndex =
      this.props.keyExtractor || defaultKeyExtractor;
    const key =
      keyExtractorWithNullableIndex != null
        ? keyExtractorWithNullableIndex(viewable.item, info.index)
        : keyExtractorWithNonNullableIndex(viewable.item, info.index ?? 0);

    return {
      ...viewable,
      index: info.index,
      key,
      section: info.section,
    };
  };

  _onViewableItemsChanged = ({
    viewableItems,
    changed,
  }) => {
    const onViewableItemsChanged = this.props.onViewableItemsChanged;
    if (onViewableItemsChanged != null) {
      onViewableItemsChanged({
        viewableItems: viewableItems
          .map(this._convertViewable, this)
          .filter(Boolean),
        changed: changed.map(this._convertViewable, this).filter(Boolean),
      });
    }
  };

  _renderItem =
    (listItemCount) =>
    // eslint-disable-next-line react/no-unstable-nested-components
    ({item, index}) => {
      const info = this._subExtractor(index);
      if (!info) {
        return null;
      }
      const infoIndex = info.index;
      if (infoIndex == null) {
        const {section} = info;
        if (info.header === true) {
          const {renderSectionHeader} = this.props;
          return renderSectionHeader ? renderSectionHeader({section}) : null;
        } else {
          const {renderSectionFooter} = this.props;
          return renderSectionFooter ? renderSectionFooter({section}) : null;
        }
      } else {
        const renderItem = info.section.renderItem || this.props.renderItem;
        const SeparatorComponent = this._getSeparatorComponent(
          index,
          info,
          listItemCount,
        );
        invariant(renderItem, 'no renderItem!');
        return (
          <ItemWithSeparator
            SeparatorComponent={SeparatorComponent}
            LeadingSeparatorComponent={
              infoIndex === 0 ? this.props.SectionSeparatorComponent : undefined
            }
            cellKey={info.key}
            index={infoIndex}
            item={item}
            leadingItem={info.leadingItem}
            leadingSection={info.leadingSection}
            prevCellKey={(this._subExtractor(index - 1) || {}).key}
            // Callback to provide updateHighlight for this item
            setSelfHighlightCallback={this._setUpdateHighlightFor}
            setSelfUpdatePropsCallback={this._setUpdatePropsFor}
            // Provide child ability to set highlight/updateProps for previous item using prevCellKey
            updateHighlightFor={this._updateHighlightFor}
            updatePropsFor={this._updatePropsFor}
            renderItem={renderItem}
            section={info.section}
            trailingItem={info.trailingItem}
            trailingSection={info.trailingSection}
            inverted={!!this.props.inverted}
          />
        );
      }
    };

  _updatePropsFor = (cellKey, value) => {
    const updateProps = this._updatePropsMap[cellKey];
    if (updateProps != null) {
      updateProps(value);
    }
  };

  _updateHighlightFor = (cellKey, value) => {
    const updateHighlight = this._updateHighlightMap[cellKey];
    if (updateHighlight != null) {
      updateHighlight(value);
    }
  };

  _setUpdateHighlightFor = (
    cellKey,
    updateHighlightFn,
  ) => {
    if (updateHighlightFn != null) {
      this._updateHighlightMap[cellKey] = updateHighlightFn;
    } else {
      delete this._updateHighlightFor[cellKey];
    }
  };

  _setUpdatePropsFor = (cellKey, updatePropsFn) => {
    if (updatePropsFn != null) {
      this._updatePropsMap[cellKey] = updatePropsFn;
    } else {
      delete this._updatePropsMap[cellKey];
    }
  };

  _getSeparatorComponent(
    index,
    info,
    listItemCount,
  ) {
    info = info || this._subExtractor(index);
    if (!info) {
      return null;
    }
    const ItemSeparatorComponent =
      info.section.ItemSeparatorComponent || this.props.ItemSeparatorComponent;
    const {SectionSeparatorComponent} = this.props;
    const isLastItemInList = index === listItemCount - 1;
    const isLastItemInSection =
      info.index === this.props.getItemCount(info.section.data) - 1;
    if (SectionSeparatorComponent && isLastItemInSection) {
      return SectionSeparatorComponent;
    }
    if (ItemSeparatorComponent && !isLastItemInSection && !isLastItemInList) {
      return ItemSeparatorComponent;
    }
    return null;
  }

  _updateHighlightMap = {};
  _updatePropsMap = {};
  _listRef;
  _captureRef = (ref) => {
    this._listRef = ref;
  };
}



function ItemWithSeparator(props) {
  const {
    LeadingSeparatorComponent,
    // this is the trailing separator and is associated with this item
    SeparatorComponent,
    cellKey,
    prevCellKey,
    setSelfHighlightCallback,
    updateHighlightFor,
    setSelfUpdatePropsCallback,
    updatePropsFor,
    item,
    index,
    section,
    inverted,
  } = props;

  const [leadingSeparatorHiglighted, setLeadingSeparatorHighlighted] =
    React.useState(false);

  const [separatorHighlighted, setSeparatorHighlighted] = React.useState(false);

  const [leadingSeparatorProps, setLeadingSeparatorProps] = React.useState({
    leadingItem: props.leadingItem,
    leadingSection: props.leadingSection,
    section: props.section,
    trailingItem: props.item,
    trailingSection: props.trailingSection,
  });
  const [separatorProps, setSeparatorProps] = React.useState({
    leadingItem: props.item,
    leadingSection: props.leadingSection,
    section: props.section,
    trailingItem: props.trailingItem,
    trailingSection: props.trailingSection,
  });

  React.useEffect(() => {
    setSelfHighlightCallback(cellKey, setSeparatorHighlighted);
    setSelfUpdatePropsCallback(cellKey, setSeparatorProps);

    return () => {
      setSelfUpdatePropsCallback(cellKey, null);
      setSelfHighlightCallback(cellKey, null);
    };
  }, [
    cellKey,
    setSelfHighlightCallback,
    setSeparatorProps,
    setSelfUpdatePropsCallback,
  ]);

  const separators = {
    highlight: () => {
      setLeadingSeparatorHighlighted(true);
      setSeparatorHighlighted(true);
      if (prevCellKey != null) {
        updateHighlightFor(prevCellKey, true);
      }
    },
    unhighlight: () => {
      setLeadingSeparatorHighlighted(false);
      setSeparatorHighlighted(false);
      if (prevCellKey != null) {
        updateHighlightFor(prevCellKey, false);
      }
    },
    updateProps: (
      select,
      newProps,
    ) => {
      if (select === 'leading') {
        if (LeadingSeparatorComponent != null) {
          setLeadingSeparatorProps({...leadingSeparatorProps, ...newProps});
        } else if (prevCellKey != null) {
          // update the previous item's separator
          updatePropsFor(prevCellKey, {...leadingSeparatorProps, ...newProps});
        }
      } else if (select === 'trailing' && SeparatorComponent != null) {
        setSeparatorProps({...separatorProps, ...newProps});
      }
    },
  };
  const element = props.renderItem({
    item,
    index,
    section,
    separators,
  });
  const leadingSeparator = LeadingSeparatorComponent != null && (
    <LeadingSeparatorComponent
      highlighted={leadingSeparatorHiglighted}
      {...leadingSeparatorProps}
    />
  );
  const separator = SeparatorComponent != null && (
    <SeparatorComponent
      highlighted={separatorHighlighted}
      {...separatorProps}
    />
  );
  return leadingSeparator || separator ? (
    <View>
      {inverted === false ? leadingSeparator : separator}
      {element}
      {inverted === false ? separator : leadingSeparator}
    </View>
  ) : (
    element
  );
}

/* $FlowFixMe[class-object-subtyping] added when improving typing for this
 * parameters */
// $FlowFixMe[method-unbinding]
module.exports = (VirtualizedSectionList);
