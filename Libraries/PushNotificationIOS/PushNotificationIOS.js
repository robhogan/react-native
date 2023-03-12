/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 */


import NativeEventEmitter from '../EventEmitter/NativeEventEmitter';
import Platform from '../Utilities/Platform';
import NativePushNotificationManagerIOS from './NativePushNotificationManagerIOS';
import invariant from 'invariant';


const PushNotificationEmitter =
  new NativeEventEmitter(
    // T88715063: NativeEventEmitter only used this parameter on iOS. Now it uses it on all platforms, so this code was modified automatically to preserve its behavior
    // If you want to use the native module on other platforms, please remove this condition and test its behavior
    Platform.OS !== 'ios' ? null : NativePushNotificationManagerIOS,
  );

const _notifHandlers = new Map();

const DEVICE_NOTIF_EVENT = 'remoteNotificationReceived';
const NOTIF_REGISTER_EVENT = 'remoteNotificationsRegistered';
const NOTIF_REGISTRATION_ERROR_EVENT = 'remoteNotificationRegistrationError';
const DEVICE_LOCAL_NOTIF_EVENT = 'localNotificationReceived';



/**
 * An event emitted by PushNotificationIOS.
 */

/**
 *
 * Handle push notifications for your app, including permission handling and
 * icon badge number.
 *
 * See https://reactnative.dev/docs/pushnotificationios
 */
class PushNotificationIOS {
  _data;
  _alert;
  _sound;
  _category;
  _contentAvailable;
  _badgeCount;
  _notificationId;
  _isRemote;
  _remoteNotificationCompleteCallbackCalled;
  _threadID;

  static FetchResult = {
    NewData: 'UIBackgroundFetchResultNewData',
    NoData: 'UIBackgroundFetchResultNoData',
    ResultFailed: 'UIBackgroundFetchResultFailed',
  };

  /**
   * Schedules the localNotification for immediate presentation.
   *
   * See https://reactnative.dev/docs/pushnotificationios#presentlocalnotification
   */
  static presentLocalNotification(details) {
    invariant(
      NativePushNotificationManagerIOS,
      'PushNotificationManager is not available.',
    );
    NativePushNotificationManagerIOS.presentLocalNotification(details);
  }

  /**
   * Schedules the localNotification for future presentation.
   *
   * See https://reactnative.dev/docs/pushnotificationios#schedulelocalnotification
   */
  static scheduleLocalNotification(details) {
    invariant(
      NativePushNotificationManagerIOS,
      'PushNotificationManager is not available.',
    );
    NativePushNotificationManagerIOS.scheduleLocalNotification(details);
  }

  /**
   * Cancels all scheduled localNotifications.
   *
   * See https://reactnative.dev/docs/pushnotificationios#cancelalllocalnotifications
   */
  static cancelAllLocalNotifications() {
    invariant(
      NativePushNotificationManagerIOS,
      'PushNotificationManager is not available.',
    );
    NativePushNotificationManagerIOS.cancelAllLocalNotifications();
  }

  /**
   * Remove all delivered notifications from Notification Center.
   *
   * See https://reactnative.dev/docs/pushnotificationios#removealldeliverednotifications
   */
  static removeAllDeliveredNotifications() {
    invariant(
      NativePushNotificationManagerIOS,
      'PushNotificationManager is not available.',
    );
    NativePushNotificationManagerIOS.removeAllDeliveredNotifications();
  }

  /**
   * Provides you with a list of the app’s notifications that are still displayed in Notification Center.
   *
   * See https://reactnative.dev/docs/pushnotificationios#getdeliverednotifications
   */
  static getDeliveredNotifications(
    callback,
  ) {
    invariant(
      NativePushNotificationManagerIOS,
      'PushNotificationManager is not available.',
    );
    NativePushNotificationManagerIOS.getDeliveredNotifications(callback);
  }

  /**
   * Removes the specified notifications from Notification Center
   *
   * See https://reactnative.dev/docs/pushnotificationios#removedeliverednotifications
   */
  static removeDeliveredNotifications(identifiers) {
    invariant(
      NativePushNotificationManagerIOS,
      'PushNotificationManager is not available.',
    );
    NativePushNotificationManagerIOS.removeDeliveredNotifications(identifiers);
  }

  /**
   * Sets the badge number for the app icon on the home screen.
   *
   * See https://reactnative.dev/docs/pushnotificationios#setapplicationiconbadgenumber
   */
  static setApplicationIconBadgeNumber(number) {
    invariant(
      NativePushNotificationManagerIOS,
      'PushNotificationManager is not available.',
    );
    NativePushNotificationManagerIOS.setApplicationIconBadgeNumber(number);
  }

  /**
   * Gets the current badge number for the app icon on the home screen.
   *
   * See https://reactnative.dev/docs/pushnotificationios#getapplicationiconbadgenumber
   */
  static getApplicationIconBadgeNumber(callback) {
    invariant(
      NativePushNotificationManagerIOS,
      'PushNotificationManager is not available.',
    );
    NativePushNotificationManagerIOS.getApplicationIconBadgeNumber(callback);
  }

  /**
   * Cancel local notifications.
   *
   * See https://reactnative.dev/docs/pushnotificationios#cancellocalnotification
   */
  static cancelLocalNotifications(userInfo) {
    invariant(
      NativePushNotificationManagerIOS,
      'PushNotificationManager is not available.',
    );
    NativePushNotificationManagerIOS.cancelLocalNotifications(userInfo);
  }

  /**
   * Gets the local notifications that are currently scheduled.
   *
   * See https://reactnative.dev/docs/pushnotificationios#getscheduledlocalnotifications
   */
  static getScheduledLocalNotifications(callback) {
    invariant(
      NativePushNotificationManagerIOS,
      'PushNotificationManager is not available.',
    );
    NativePushNotificationManagerIOS.getScheduledLocalNotifications(callback);
  }

  /**
   * Attaches a listener to remote or local notification events while the app
   * is running in the foreground or the background.
   *
   * See https://reactnative.dev/docs/pushnotificationios#addeventlistener
   */
  static addEventListener(
    type,
    handler,
  ) {
    invariant(
      type === 'notification' ||
        type === 'register' ||
        type === 'registrationError' ||
        type === 'localNotification',
      'PushNotificationIOS only supports `notification`, `register`, `registrationError`, and `localNotification` events',
    );
    let listener;
    if (type === 'notification') {
      listener = PushNotificationEmitter.addListener(
        DEVICE_NOTIF_EVENT,
        notifData => {
          handler(new PushNotificationIOS(notifData));
        },
      );
    } else if (type === 'localNotification') {
      listener = PushNotificationEmitter.addListener(
        DEVICE_LOCAL_NOTIF_EVENT,
        notifData => {
          handler(new PushNotificationIOS(notifData));
        },
      );
    } else if (type === 'register') {
      listener = PushNotificationEmitter.addListener(
        NOTIF_REGISTER_EVENT,
        registrationInfo => {
          handler(registrationInfo.deviceToken);
        },
      );
    } else if (type === 'registrationError') {
      listener = PushNotificationEmitter.addListener(
        NOTIF_REGISTRATION_ERROR_EVENT,
        errorInfo => {
          handler(errorInfo);
        },
      );
    }
    _notifHandlers.set(type, listener);
  }

  /**
   * Removes the event listener. Do this in `componentWillUnmount` to prevent
   * memory leaks.
   *
   * See https://reactnative.dev/docs/pushnotificationios#removeeventlistener
   */
  static removeEventListener(
    type,
    handler,
  ) {
    invariant(
      type === 'notification' ||
        type === 'register' ||
        type === 'registrationError' ||
        type === 'localNotification',
      'PushNotificationIOS only supports `notification`, `register`, `registrationError`, and `localNotification` events',
    );
    const listener = _notifHandlers.get(type);
    if (!listener) {
      return;
    }
    listener.remove();
    _notifHandlers.delete(type);
  }

  /**
   * Requests notification permissions from iOS, prompting the user's
   * dialog box. By default, it will request all notification permissions, but
   * a subset of these can be requested by passing a map of requested
   * permissions.
   *
   * See https://reactnative.dev/docs/pushnotificationios#requestpermissions
   */
  static requestPermissions(permissions) {
    let requestedPermissions = {
      alert: true,
      badge: true,
      sound: true,
    };
    if (permissions) {
      requestedPermissions = {
        alert: !!permissions.alert,
        badge: !!permissions.badge,
        sound: !!permissions.sound,
      };
    }
    invariant(
      NativePushNotificationManagerIOS,
      'PushNotificationManager is not available.',
    );
    return NativePushNotificationManagerIOS.requestPermissions(
      requestedPermissions,
    );
  }

  /**
   * Unregister for all remote notifications received via Apple Push Notification service.
   *
   * See https://reactnative.dev/docs/pushnotificationios#abandonpermissions
   */
  static abandonPermissions() {
    invariant(
      NativePushNotificationManagerIOS,
      'PushNotificationManager is not available.',
    );
    NativePushNotificationManagerIOS.abandonPermissions();
  }

  /**
   * See what push permissions are currently enabled. `callback` will be
   * invoked with a `permissions` object.
   *
   * See https://reactnative.dev/docs/pushnotificationios#checkpermissions
   */
  static checkPermissions(callback) {
    invariant(typeof callback === 'function', 'Must provide a valid callback');
    invariant(
      NativePushNotificationManagerIOS,
      'PushNotificationManager is not available.',
    );
    NativePushNotificationManagerIOS.checkPermissions(callback);
  }

  /**
   * This method returns a promise that resolves to either the notification
   * object if the app was launched by a push notification, or `null` otherwise.
   *
   * See https://reactnative.dev/docs/pushnotificationios#getinitialnotification
   */
  static getInitialNotification() {
    invariant(
      NativePushNotificationManagerIOS,
      'PushNotificationManager is not available.',
    );
    return NativePushNotificationManagerIOS.getInitialNotification().then(
      notification => {
        return notification && new PushNotificationIOS(notification);
      },
    );
  }

  /**
   * This method returns a promise that resolves to notification authorization status.
   */
  static getAuthorizationStatus(
    callback,
  ) {
    invariant(
      NativePushNotificationManagerIOS,
      'PushNotificationManager is not available.',
    );

    NativePushNotificationManagerIOS.getAuthorizationStatus(callback);
  }

  /**
   * You will never need to instantiate `PushNotificationIOS` yourself.
   * Listening to the `notification` event and invoking
   * `getInitialNotification` is sufficient
   *
   */
  constructor(nativeNotif) {
    this._data = {};
    this._remoteNotificationCompleteCallbackCalled = false;
    this._isRemote = nativeNotif.remote;
    if (this._isRemote) {
      this._notificationId = nativeNotif.notificationId;
    }

    if (nativeNotif.remote) {
      // Extract data from Apple's `aps` dict as defined:
      // https://developer.apple.com/library/ios/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/Chapters/ApplePushService
      Object.keys(nativeNotif).forEach(notifKey => {
        const notifVal = nativeNotif[notifKey];
        if (notifKey === 'aps') {
          this._alert = notifVal.alert;
          this._sound = notifVal.sound;
          this._badgeCount = notifVal.badge;
          this._category = notifVal.category;
          this._contentAvailable = notifVal['content-available'];
          this._threadID = notifVal['thread-id'];
        } else {
          this._data[notifKey] = notifVal;
        }
      });
    } else {
      // Local notifications aren't being sent down with `aps` dict.
      this._badgeCount = nativeNotif.applicationIconBadgeNumber;
      this._sound = nativeNotif.soundName;
      this._alert = nativeNotif.alertBody;
      this._data = nativeNotif.userInfo;
      this._category = nativeNotif.category;
    }
  }

  /**
   * This method is available for remote notifications that have been received via:
   * `application:didReceiveRemoteNotification:fetchCompletionHandler:`
   *
   * See https://reactnative.dev/docs/pushnotificationios#finish
   */
  finish(fetchResult) {
    if (
      !this._isRemote ||
      !this._notificationId ||
      this._remoteNotificationCompleteCallbackCalled
    ) {
      return;
    }
    this._remoteNotificationCompleteCallbackCalled = true;

    invariant(
      NativePushNotificationManagerIOS,
      'PushNotificationManager is not available.',
    );
    NativePushNotificationManagerIOS.onFinishRemoteNotification(
      this._notificationId,
      fetchResult,
    );
  }

  /**
   * An alias for `getAlert` to get the notification's main message string
   */
  getMessage() {
    // alias because "alert" is an ambiguous name
    return this._alert;
  }

  /**
   * Gets the sound string from the `aps` object
   *
   * See https://reactnative.dev/docs/pushnotificationios#getsound
   */
  getSound() {
    return this._sound;
  }

  /**
   * Gets the category string from the `aps` object
   *
   * See https://reactnative.dev/docs/pushnotificationios#getcategory
   */
  getCategory() {
    return this._category;
  }

  /**
   * Gets the notification's main message from the `aps` object
   *
   * See https://reactnative.dev/docs/pushnotificationios#getalert
   */
  getAlert() {
    return this._alert;
  }

  /**
   * Gets the content-available number from the `aps` object
   *
   * See https://reactnative.dev/docs/pushnotificationios#getcontentavailable
   */
  getContentAvailable() {
    return this._contentAvailable;
  }

  /**
   * Gets the badge count number from the `aps` object
   *
   * See https://reactnative.dev/docs/pushnotificationios#getbadgecount
   */
  getBadgeCount() {
    return this._badgeCount;
  }

  /**
   * Gets the data object on the notif
   *
   * See https://reactnative.dev/docs/pushnotificationios#getdata
   */
  getData() {
    return this._data;
  }

  /**
   * Gets the thread ID on the notif
   *
   * See https://reactnative.dev/docs/pushnotificationios#getthreadid
   */
  getThreadID() {
    return this._threadID;
  }
}

module.exports = PushNotificationIOS;
