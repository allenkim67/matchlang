import axios from '../axios'
import userValidator from '../validators/user'
import config from '../../global-config'

export const fetch = params => async (dispatch, getState) => {
  dispatch({type: 'FETCH_USERS_START'});

  const [users, count] = await Promise.all([
    axios.get('users', {params}),
    axios.get('users/count', {params})
  ]);

  dispatch({type: 'FETCH_USERS_SUCCESS', users: users.data, count: count.data});
};

export const update = userData => async dispatch => {
  function signupError(errors) {
    return {type: 'UPDATE_USER_ERROR', errors};
  }

  dispatch({type: 'UPDATE_USER_START'});

  const v = userValidator.validateUpdate(userData);

  if (v.isValid) {
    try {
      const user = await axios.put('users', userData);
      dispatch({type: 'UPDATE_USER_SUCCESS', user: user.data});
      setTimeout(() => dispatch({type: 'CLEAR_UPDATED_ALERT'}), 2500);
    } catch (err) {
      console.log(err);
      if (err.status === 400) dispatch(signupError([err.data]));
    }
  } else {
    dispatch(signupError(v.errors));
  }
};

export const setOnlineUsers = onlineUsers => {
  return {type: 'SET_ONLINE_USERS', onlineUsers};
};

export const addOnlineUser = userId => {
  return {type: 'UPDATE_USER_ONLINE', userId};
};

export const removeOnlineUser = userId => {
  return {type: 'UPDATE_USER_OFFLINE', userId};
};

export const updateCredits = () => async dispatch => {
  const user = await axios.get('users/self');
  dispatch(update(user.data));
};