import React, { Component } from 'react'
import PushNotification from 'react-native-push-notification'

export default class extends Component {
  componentDidMount() {
    PushNotification.configure({
      onRegister: function(token) {
        console.log(token);
      },

      onNotification: function(notification) {
        console.log( 'NOTIFICATION:', notification );
      }
    });

    PushNotification.localNotificationSchedule({
      message: "My Notification Message", // (required)
      date: new Date(Date.now() + (5 * 1000)) // in 60 secs
    });
  }

  render() {
    return null;
  }
}