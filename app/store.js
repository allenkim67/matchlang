import { applyMiddleware, createStore } from 'redux'
import thunk from 'redux-thunk'
//import logger from 'redux-logger'
import reducers from './reducers'
import socket from './socket-middleware'

const middleware = applyMiddleware(
  thunk,
  //logger(),
  socket
);

export default createStore(reducers, middleware);