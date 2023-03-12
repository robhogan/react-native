/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 */


import AndroidSwipeRefreshLayoutNativeComponent, {
  Commands as AndroidSwipeRefreshLayoutCommands,
} from './AndroidSwipeRefreshLayoutNativeComponent';
import PullToRefreshViewNativeComponent, {
  Commands as PullToRefreshCommands,
} from './PullToRefreshViewNativeComponent';

const Platform = require('../../Utilities/Platform');
const React = require('react');




/**
 * This component is used inside a ScrollView or ListView to add pull to refresh
 * functionality. When the ScrollView is at `scrollY: 0`, swiping down
 * triggers an `onRefresh` event.
 *
 * ### Usage example
 *
 * ``` js
 * class RefreshableList extends Component {
 *   constructor(props) {
 *     super(props);
 *     this.state = {
 *       refreshing: false,
 *     };
 *   }
 *
 *   _onRefresh() {
 *     this.setState({refreshing: true});
 *     fetchData().then(() => {
 *       this.setState({refreshing: false});
 *     });
 *   }
 *
 *   render() {
 *     return (
 *       <ListView
 *         refreshControl={
 *           <RefreshControl
 *             refreshing={this.state.refreshing}
 *             onRefresh={this._onRefresh.bind(this)}
 *           />
 *         }
 *         ...
 *       >
 *       ...
 *       </ListView>
 *     );
 *   }
 *   ...
 * }
 * ```
 *
 * __Note:__ `refreshing` is a controlled prop, this is why it needs to be set to true
 * in the `onRefresh` function otherwise the refresh indicator will stop immediately.
 */
class RefreshControl extends React.Component {
  _nativeRef;
  _lastNativeRefreshing = false;

  componentDidMount() {
    this._lastNativeRefreshing = this.props.refreshing;
  }

  componentDidUpdate(prevProps) {
    // RefreshControl is a controlled component so if the native refreshing
    // value doesn't match the current js refreshing prop update it to
    // the js value.
    if (this.props.refreshing !== prevProps.refreshing) {
      this._lastNativeRefreshing = this.props.refreshing;
    } else if (
      this.props.refreshing !== this._lastNativeRefreshing &&
      this._nativeRef
    ) {
      if (Platform.OS === 'android') {
        AndroidSwipeRefreshLayoutCommands.setNativeRefreshing(
          this._nativeRef,
          this.props.refreshing,
        );
      } else {
        PullToRefreshCommands.setNativeRefreshing(
          this._nativeRef,
          this.props.refreshing,
        );
      }
      this._lastNativeRefreshing = this.props.refreshing;
    }
  }

  render() {
    if (Platform.OS === 'ios') {
      const {enabled, colors, progressBackgroundColor, size, ...props} =
        this.props;
      return (
        <PullToRefreshViewNativeComponent
          {...props}
          ref={this._setNativeRef}
          onRefresh={this._onRefresh}
        />
      );
    } else {
      const {tintColor, titleColor, title, ...props} = this.props;
      return (
        <AndroidSwipeRefreshLayoutNativeComponent
          {...props}
          ref={this._setNativeRef}
          onRefresh={this._onRefresh}
        />
      );
    }
  }

  _onRefresh = () => {
    this._lastNativeRefreshing = true;

    this.props.onRefresh && this.props.onRefresh();

    // The native component will start refreshing so force an update to
    // make sure it stays in sync with the js component.
    this.forceUpdate();
  };

  _setNativeRef = (
    ref,
  ) => {
    this._nativeRef = ref;
  };
}

module.exports = RefreshControl;
