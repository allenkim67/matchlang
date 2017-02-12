import axios from '../axios'
import routeTo from '../route-action'
import sessionValidator from '../validators/session'
import userValidator from '../validators/user'
import { fetchConvos, setCurrentConvo } from './convos'
import { fetch as fetchUsers } from './users'
import { currentConvoType, currentConvo, currentId } from '../selectors/convos'

function loginSuccess(dispatch, getState) {
  axios.put('users/active');
  dispatch(connectSocket());
  dispatch(fetchConvos());

  if (process.env.NODE_ENV === 'production') {
    ga('set', 'userId', String(getState().session.user.id));
  }

  routeTo('/');
}

export const login = creds => async (dispatch, getState) => {
  function loginError(errors) {
    return {type: 'LOGIN_ERROR', errors}
  }

  dispatch({type: 'LOGIN_START'});

  const v = sessionValidator.validateLogin(creds);

  if (v.isValid) {
    try {
      const user = await axios.post('session/login', v.cleanData);
      dispatch({type: 'LOGIN_SUCCESS', user: user.data});
      loginSuccess(dispatch, getState);
    } catch (err) {
      console.log(err);
      if (err.status === 400) dispatch(loginError([err.data]));
    }
  } else {
    dispatch(loginError(v.errors));
  }
};

export const signup = userData => async (dispatch, getState) => {
  function signupError(errors) {
    return {type: 'SIGNUP_ERROR', errors};
  }

  dispatch({type: 'SIGNUP_START'});

  const v = userValidator.validateCreate(userData);

  if (v.isValid) {
    try {
      const user = await axios.post('session/signup', userData);
      dispatch({type: 'SIGNUP_SUCCESS', user: user.data});
      routeTo('/');
      loginSuccess(dispatch, getState);

      if (process.env.NODE_ENV === 'production') {
        ga('send', 'event', 'form', 'signup');
      }
    } catch (err) {
      console.log(err);
      if (err.status === 400) dispatch(signupError([err.data]));
    }
  } else {
    dispatch(signupError(v.errors));
  }
};

export const logout = () => async dispatch => {
  routeTo('/signup');
  dispatch({type: 'LOGOUT_START'});
  await axios.post('session/logout');
  dispatch({type: 'LOGOUT_SUCCESS', socket: {type: 'DISCONNECT'}});
};

export const connectSocket = () => {
  return {type: 'CONNECT_SOCKET', socket: {type: 'CONNECT'}};
};

export const toggleMode = (isTeacher, location) => (dispatch, getState) => {
  dispatch({type: 'TOGGLE_MODE', teacher: isTeacher});
  //if (getState().convos.currentPartnerId) routeTo('/');
  //if (location === '/search' || location === '/') dispatch(fetchUsers());
  //axios.put('users', {teacher: isTeacher});
};

export const incrCredits = ({token, amount}) => async dispatch => {
  try {
    const res = await axios.post('charges', {...token, amount});
    dispatch({type: 'INCR_CREDITS', amount: res.data.amount});
  } catch (err) {

  }
};

export const forceUnreadStatus = unread => {
  return {type: 'FORCE_UNREAD_STATUS', unread};
};

export const reconnect = () => async (dispatch, getState) => {
  const userId = getState().session.user.id;

  if (userId) {
    await dispatch(fetchConvos());

    const convo = currentConvo(getState());

    if (convo) {
      dispatch(setCurrentConvo({
        convoType: currentConvoType(getState()),
        id: currentId(getState())
      }));
    }
  }

  dispatch({
    type: 'RECONNECT',
    socket: {
      type: 'EMIT',
      event: 'reconnect1',
      payload: userId
    }
  })
};