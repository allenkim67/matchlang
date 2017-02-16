import React, {Component} from 'react'
import { Provider } from 'react-redux'
import Routes from './routes'
import store from '../../store'
import { View, StatusBar } from 'react-native'
import PushNotification from 'react-native-push-notification'

export default class extends Component {
  render() {
    StatusBar.setBarStyle('light-content', true);

    return (
      <Provider store={store}>
        <Routes store={store}/>
      </Provider>
    );
  }
}

PushNotification.configure({
  onNotification: function(notification) {
    console.log( 'NOTIFICATION:', notification );
  }
});

PushNotification.localNotificationSchedule({
  message: "My Notification Message", // (required)
  date: new Date(Date.now() + (5 * 1000)) // in 60 secs
});