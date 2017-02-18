import React, { Component } from 'react'
import FCM, { FCMEvent } from 'react-native-fcm';

export default class extends Component {
  componentDidMount() {
    FCM.getFCMToken().then(token => {
      this.props.registerMobile(token);
    });

    FCM.on(FCMEvent.Notification, async notif => {
      alert(JSON.stringify(notif));
    })
  }

  render() {
    return null;
  }
}