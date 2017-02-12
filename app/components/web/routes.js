import React from 'react'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import Main from './main'
import Groups from './main/groups'
import UserBrowser from './main/user-browser'
import Account from './main/profile'
import Profile from './main/profile/public'
import Review from './main/review'
import Chat from './main/chat'
import Faq from './main/faq'
import Signup from './signup'

const requireAuth = store => (nextState, replace) => {
  if (!store.getState().session.user) {
    replace({
      pathname: '/signup'
    });
  }
};

export default props => (
  <Router history={browserHistory}>
    <Route path='/signup' component={Signup}/>
    <Route path='/' component={Main} onEnter={requireAuth(props.store)}>
      <IndexRoute component={Groups} />
      <Route path='/groups(/:mode(/:page))' component={Groups} />
      <Route path='/search(/:page)' component={UserBrowser} />
      <Route path='/account' component={Account} />
      <Route path='/review' component={Review} />
      <Route path='/tutorial' component={Faq} />
      <Route path='/chat/:type/:id' component={Chat} />
      <Route path='/:username' component={Profile} />
    </Route>
  </Router>
);