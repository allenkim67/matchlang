import io from 'socket.io-client'
import { receiveMessage } from './actions/messages'
import { incrUnread, receiveIsTyping, receiveStopTyping } from './actions/convos'
import { setOnlineUsers, addOnlineUser, removeOnlineUser } from './actions/users'
import { reconnect } from './actions/session'
import config from '../global-config'

function listenMessages(socket, store) {
  socket.on('message', m => store.dispatch(receiveMessage(m)));
  socket.on('online_users', users => store.dispatch(setOnlineUsers(users)));
  socket.on('user_online', userId => store.dispatch(addOnlineUser(userId)));
  socket.on('user_offline', userId => store.dispatch(removeOnlineUser(userId)));
  socket.on('user_is_typing', payload => store.dispatch(receiveIsTyping(payload)));
  socket.on('user_stop_typing', payload => store.dispatch(receiveStopTyping(payload)));
  socket.on('reconnect', () => store.dispatch(reconnect()));
}

function connect(store) {
  const socket = io.connect(config.baseUrl, {jsonp: false});
  socket.emit('login', store.getState().session.user.id);
  listenMessages(socket, store);
  return socket;
}

export default store => {
  let socket;

  if (store.getState().session.user) {
    socket = connect(store);
  }

  return next => action => {
    if (action.socket) {
      switch (action.socket.type) {
        case 'CONNECT':
          socket = connect(store);
          break;
        case 'DISCONNECT':
          socket.emit('logout');
          socket.disconnect();
          break;
        case 'EMIT':
          socket.emit(action.socket.event, action.socket.payload);
          break;
        default:
          break;
      }
    }
    next(action);
  }
}