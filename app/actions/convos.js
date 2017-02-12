import axios from '../axios'
import { currentId, findConvoByKey, currentConvoType } from '../selectors/convos'
import { fetchMessages } from './messages'
import normalize from '../normalizers/convos'
import routeTo from '../route-action'

export const fetchConvos = () => async dispatch => {
  dispatch({type: 'FETCH_CONVOS_START'});
  const convos = (await axios.get('convos')).data;
  dispatch({type: 'FETCH_CONVOS_SUCCESS', convos: normalize(convos)});
};

export const setCurrentConvo = ({convoType, id}) => async (dispatch, getState) => {
  const idType = convoType === 'group' ? 'convoId' : 'partnerId';

  let convo = findConvoByKey(getState(), {convoType, id});

  if (!convo) {
    await dispatch(createConvo({convoType, id}));
    convo = findConvoByKey(getState(), {convoType, id});
  }

  dispatch({type: 'SET_CURRENT_CONVO', convoType, [idType]: id});

  if (convo.unread > 0) {
    // persist cleared unread
    axios.post(`convos/private/${id}`, {unread: 0});
  }

  if (!convo.full) dispatch(fetchMessages(convoType, convo.id));
};

export const createConvo = ({id, convoType, convoData={}}) => async dispatch => {
  const convo = (await axios.post(`convos/${convoType}/${id}`, convoData)).data;
  dispatch({type: 'CREATE_CONVO', convo, convoType, id});
};

export const clearCurrentConvo = () => {
  return {type: 'CLEAR_CURRENT_CONVO'};
};

export const incrUnread = message => (dispatch, getState) => {
  const id = message.receiverConvoType === 'group' ? message.convo_id : message.sender_id;
  dispatch({
    type: 'INCR_UNREAD',
    id,
    convoType: message.receiverConvoType
  });

  const convo = findConvoByKey(getState(), {convoType: message.receiverConvoType, id});
  axios.post(`convos/${message.receiverConvoType}/${id}`, {unread: convo.unread});
};

export const leaveConvo = convoId => (dispatch, getState) => {
  dispatch({type: 'LEAVE_GROUP_CONVO', id: convoId});
  axios.post('convos/group/unjoin/' + convoId);
  if (currentId(getState()) === convoId) routeTo('/');
};

export const reorderConvos = (id, convoType) => {
  return {
    type: 'REORDER_CONVOS',
    id,
    convoType
  }
};

export const isTyping = () => (dispatch, getState) => {
  const user = getState().session.user;
  const username = user.username;

  const payload = {
    user: {username, id: user.id},
    currentId: currentId(getState()),
    convoType: currentConvoType(getState())
  };

  if (!getState().convos.typers[username]) {
    dispatch({
      type: 'IS_TYPING',
      ...payload,
      socket: {
        type: 'EMIT',
        event: 'is_typing',
        payload
      }
    });
  }
};

export const stopTyping = () => (dispatch, getState) => {
  const user = getState().session.user;
  const username = user.username;

  const payload = {
    user: {username, id: user.id}
  };

  if (getState().convos.typers[username]) {
    dispatch({
      type: 'STOP_TYPING',
      ...payload,
      socket: {
        type: 'EMIT',
        event: 'stop_typing',
        payload
      }
    });
  }
};

export const receiveIsTyping = payload => (dispatch, getState) => {
  dispatch({type: 'IS_TYPING', ...payload});
  setTimeout(() => {
    if (getState().convos.typers[payload.user.username]) {
      dispatch(receiveStopTyping(payload));
    }
  }, 5000);
};

export const receiveStopTyping = payload => {
  return {type: 'STOP_TYPING', ...payload};
};