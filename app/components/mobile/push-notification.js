import React, { Component } from 'react'
import PushNotification from 'react-native-push-notification'

export default class extends Component {
  componentDidMount() {
    PushNotification.configure({
      onRegister: token => {
        this.props.registerMobile(token.token);
      },

      onNotification: notification => {
        alert(JSON.stringify(notification));

        PushNotification.localNotification({
          message: notification.data.message
        });
      },

      senderID: "727270660645"
    });
  }

  render() {
    return null;
  }
}