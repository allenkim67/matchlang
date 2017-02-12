import React from 'react'
import {render} from 'react-dom'
import css from './signup.scss'
import Login from './login'
import Signup from './signup'

export default () => (
  <div className={css.container}>
    <img className={css.logo} src="/MatchLang-logo-beta.png"/>
    <div className={css.formsContainer}>
      <Login/>
      <Signup/>
    </div>
  </div>
);