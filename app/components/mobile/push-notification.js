import React, { Component } from 'react'
import PushNotification from 'react-native-push-notification'

export default class extends Component {
  componentDidMount() {
    PushNotification.configure({
      onRegister: function(token) {
        this.props.registerMobile(token.token);
      },

      onNotification: function(notification) {
        console.log( 'NOTIFICATION:', notification );
      },

      senderID: "matchlang-149620"
    });

    PushNotification.localNotificationSchedule({
      message: "My Notification Message", // (required)
      date: new Date(Date.now() + (15 * 1000)) // in 60 secs
    });
  }

  render() {
    return null;
  }
}