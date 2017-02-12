import React, { Component } from 'react'
import { Router, Scene } from 'react-native-router-flux'
import Login from './login'
import Signup from './signup'
import MainTabs from './main-tabs'
import Chat from './chat'
//import { Actions, ActionConst, Reducer } from 'react-native-router-flux'
import { primaryColor, textColor } from './style-theme'

const style = {
  nav: {
    backgroundColor: primaryColor,
    borderBottomColor: primaryColor
  },

  title: {
    color: textColor
  },

  back: {
    tintColor: textColor
  }
};

export default class Routes extends Component {
  render() {
    return (
      <Router navigationBarStyle={style.nav} titleStyle={style.title}>
        <Scene key="root" leftButtonIconStyle={style.back}>
          <Scene key="login" component={Login} title="Login" initial={true} initial={true}/>
          <Scene key="signup" component={Signup} title="Sign Up"/>
          <Scene key="/" component={MainTabs} title="Matchlang" type="replace"/>
          <Scene key="chat" component={Chat}/>
        </Scene>
      </Router>
    )
  }
}