import React, {Component} from 'react'
import { Provider } from 'react-redux'
import Routes from './routes'
import store from '../../store'
import { View, StatusBar } from 'react-native'

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