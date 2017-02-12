import axios from '../axios'
import omit from 'lodash/omit'
//import Cookies from 'js-cookie'
import Push from 'push.js'
import { browserHistory } from 'react-router'
import { forceUnreadStatus } from './session'
import { createConvo, incrUnread, reorderConvos } from './convos'
import { updateCredits } from './users'
import { currentConvo as currentConvoSelector, findConvoByConvoId, currentConvoType, currentId } from '../selectors/convos'
import { currentUserId } from '../selectors/session'
import normalizeMessages from '../normalizers/messages'
import normalizeFavs from '../normalizers/review'

export const fetchFavs = () => async dispatch => {
  dispatch({type: 'FETCH_FAVS_START'});
  const messages = (await axios.get('messages/favorites')).data;
  dispatch({type: 'FETCH_FAVS_SUCCESS', favs: normalizeFavs(messages)});
};

export const fetchMessages = (type, convoId, offset=0) => async dispatch => {
  dispatch({type: 'FETCH_MESSAGES_START', reset: !offset});

  let messages = [];

  if (convoId) {
    messages = (await axios.get(`/messages/${type}/${convoId}`, {params: {offset}})).data;
  }

  dispatch({
    type: 'FETCH_MESSAGES_SUCCESS',
    messages: normalizeMessages(messages),
    reset: !offset
  });
};

export const sendMessage = ({content, parentId=null}) => async (dispatch, getState) => {
  if (!content || content === '') return;

  const key = Math.random();
  const currentConvo = currentConvoSelector(getState());
  const convoKey = currentConvoType(getState());
  const convoType = convoKey === 'group' ? 'group' : 'private';
  const sender = getState().session.user;

  const optimisticMsg = {
    key,
    content,
    parent_id: parentId,
    sender,
    messages: parentId ? null : []
  };

  dispatch({type: 'ADD_MESSAGE', message: optimisticMsg});
  dispatch(reorderConvos(currentId(getState()), convoKey));

  try {
    const serverMsg = {
      content,
      parent_id: parentId,
      convo_id: currentConvo.id
    };

    const savedMessage = (await axios.post(`/messages/${convoType}/`, serverMsg)).data;
    const id = currentUserId(getState());

    dispatch({
      type: 'UPDATE_MESSAGE',
      message: savedMessage,
      key,
      socket: {
        type: 'EMIT',
        event: 'message',
        payload: {
          message: {...savedMessage, receiverConvoType: currentConvoType(getState())},
          user: {id}
        }
      }
    });

    //dispatch(updateCredits());
  } catch (err) {
    console.log(err);
    if (err.status === 400) dispatch({
      type: 'UPDATE_MESSAGE',
      message: {...optimisticMsg, error: err.data.message},
      key
    });
  }
};

export const receiveMessage = message => (dispatch, getState) => {
  const receivingConvo = findConvoByConvoId(getState(), {convoType: message.receiverConvoType, id: message.convo_id});

  if (!receivingConvo) {
    dispatch(createConvo({
      id: message.sender_id,
      convoType: message.receiverConvoType,
      convoData: {unread: 1}
    }));
  } else {
    if (receivingConvo !== currentConvoSelector(getState())) {
      dispatch(incrUnread(message));
    } else {
      if (message.updated) {
        dispatch({type: 'UPDATE_MESSAGE', message: omit(message, 'updated')});
      } else {
        dispatch({type: 'ADD_MESSAGE', message});
      }
    }

    const convoId = message.receiverConvoType === 'group' ? receivingConvo.id : message.sender_id;
    dispatch(reorderConvos(convoId, message.receiverConvoType));
  }

  if (process.env.PLATFORM === 'web' && !document.hasFocus() && message.receiverConvoType !== 'group') {
    pushNote(message);
    dispatch(forceUnreadStatus(true));
  }

  if (!message.updated) dispatch(updateCredits());
};

function pushNote(message)  {
  new Audio('/served.mp3').play();

  Push.create('new message!', {
    body: message.content,
    timeout: 4000,
    onClick: function() {
      window.focus();
      this.close();
    }
  });
}

export const updateMessage = (message, data) => (dispatch, getState) => {
  const updatedMessage = {...message, ...data};
  const id = currentUserId(getState());

  dispatch({
    type: 'UPDATE_MESSAGE',
    message: updatedMessage,
    socket: {
      type: 'EMIT',
      event: 'message',
      payload: {
        message: {...updatedMessage, updated: true, receiverConvoType: currentConvoType(getState())},
        user: {id}
      }
    }
  });

  axios.put('messages/' + message.id, data);
};

export const setFavorite = (page, message) => async dispatch => {
  const status = !message.favorite;

  const actionType = page === 'chat' ? 'UPDATE_MESSAGE' : 'UPDATE_SAVED';

  message = {...message, favorite: status};

  dispatch({type: actionType, message});

  await axios.post('messages/favorite/' + message.id, {status});
};

export const translate = (message, lang) => async dispatch => {
  const translation = (await axios.post('messages/translate', {
    content: message.content,
    lang
  })).data;

  dispatch({
    type: 'UPDATE_MESSAGE',
    message: {...message, translation}
  });
};