require('viewport-units-buggyfill').init();

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import Routes from './routes'
import store from '../../store'
import './global.scss'
import 'normalize.css/normalize.css'

window.store = store;

const app = (
  <Provider store={store}>
    <Routes store={store}/>
  </Provider>
);

ReactDOM.render(app, document.getElementById('content'));

if ('Notification' in window && Notification.permission === 'default') {
  Notification.requestPermission();
}