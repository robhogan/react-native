/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 *  strict-local
 */

// This is a controlled component version of RCTDatePickerIOS.

import * as React from 'react';
import RCTDatePickerNativeComponent, {
  Commands as DatePickerCommands,
} from './RCTDatePickerNativeComponent';
import StyleSheet from '../../StyleSheet/StyleSheet';
import View from '../View/View';
import invariant from 'invariant';




/**
 * Use `DatePickerIOS` to render a date/time picker (selector) on iOS.  This is
 * a controlled component, so you must hook in to the `onDateChange` callback
 * and update the `date` prop in order for the component to update, otherwise
 * the user's change will be reverted immediately to reflect `props.date` as the
 * source of truth.
 */
class DatePickerIOS extends React.Component {
  _picker = null;

  componentDidUpdate() {
    if (this.props.date) {
      const propsTimeStamp = this.props.date.getTime();
      if (this._picker) {
        DatePickerCommands.setNativeDate(this._picker, propsTimeStamp);
      }
    }
  }

  _onChange = (event) => {
    const nativeTimeStamp = event.nativeEvent.timestamp;
    this.props.onDateChange &&
      this.props.onDateChange(new Date(nativeTimeStamp));
    this.props.onChange && this.props.onChange(event);
    this.forceUpdate();
  };

  render() {
    const props = this.props;
    const mode = props.mode ?? 'datetime';
    invariant(
      props.date || props.initialDate,
      'A selected date or initial date should be specified.',
    );
    return (
      <View style={props.style}>
        <RCTDatePickerNativeComponent
          testID={props.testID}
          ref={picker => {
            this._picker = picker;
          }}
          style={getHeight(props.pickerStyle, mode)}
          date={
            props.date
              ? props.date.getTime()
              : props.initialDate
              ? props.initialDate.getTime()
              : undefined
          }
          locale={
            props.locale != null && props.locale !== ''
              ? props.locale
              : undefined
          }
          maximumDate={
            props.maximumDate ? props.maximumDate.getTime() : undefined
          }
          minimumDate={
            props.minimumDate ? props.minimumDate.getTime() : undefined
          }
          mode={mode}
          minuteInterval={props.minuteInterval}
          timeZoneOffsetInMinutes={props.timeZoneOffsetInMinutes}
          onChange={this._onChange}
          onStartShouldSetResponder={() => true}
          onResponderTerminationRequest={() => false}
          pickerStyle={props.pickerStyle}
        />
      </View>
    );
  }
}

const inlineHeightForDatePicker = 318.5;
const inlineHeightForTimePicker = 49.5;
const compactHeight = 40;
const spinnerHeight = 216;

const styles = StyleSheet.create({
  datePickerIOS: {
    height: spinnerHeight,
  },
  datePickerIOSCompact: {
    height: compactHeight,
  },
  datePickerIOSInline: {
    height: inlineHeightForDatePicker + inlineHeightForTimePicker * 2,
  },
  datePickerIOSInlineDate: {
    height: inlineHeightForDatePicker + inlineHeightForTimePicker,
  },
  datePickerIOSInlineTime: {
    height: inlineHeightForTimePicker,
  },
});

function getHeight(
  pickerStyle,
  mode,
) {
  if (pickerStyle === 'compact') {
    return styles.datePickerIOSCompact;
  }
  if (pickerStyle === 'inline') {
    switch (mode) {
      case 'date':
        return styles.datePickerIOSInlineDate;
      case 'time':
        return styles.datePickerIOSInlineTime;
      default:
        return styles.datePickerIOSInline;
    }
  }
  return styles.datePickerIOS;
}

module.exports = DatePickerIOS;
