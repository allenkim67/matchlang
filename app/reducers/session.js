const initialState = {
  user: typeof SESSION !== 'undefined' ? SESSION.user : null,
  loginErrors: [],
  signupErrors: [],
  profileErrors: [],
  loading: false,
  alertUpdated: false,
  forceUnread: false
};

export default (state=initialState, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return {...state, loading: true};
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.user,
        loading: false,
        online: true,
        loginErrors: [],
        signupErrors: []
      };
    case 'LOGIN_ERROR':
      return {...state, loading: false, loginErrors: action.errors};

    case 'SIGNUP_START':
      return {...state, loading: true};
    case 'SIGNUP_SUCCESS':
      return {
        ...state,
        user: action.user,
        loading: false,
        online: true,
        loginErrors: [],
        signupErrors: []
      };
    case 'SIGNUP_ERROR':
      return {...state, loading: false, signupErrors: action.errors};

    case 'LOGOUT_START':
      return {...state, loading: true};
    case 'LOGOUT_SUCCESS':
      return {...state, loading: false, user: null, online: false};


    case 'UPDATE_USER_START':
      return {...state, loading: true};
    case 'UPDATE_USER_SUCCESS':
      return {...state, loading: false, user: action.user, profileErrors: [], alertUpdated: true};
    case 'UPDATE_USER_ERROR':
      return {...state, loading: false, profileErrors: action.errors};
    case 'CLEAR_UPDATED_ALERT':
      return {...state, alertUpdated: false};

    case 'TOGGLE_MODE':
      return {...state, user: {...state.user, teacher: !state.user.teacher}};

    case 'INCR_CREDITS':
      return {...state, user: {...state.user, credits: state.user.credits + action.amount}};
    case 'DECR_CREDITS':
      return {...state, user: {...state.user, credits: state.user.credits - action.amount}};

    case 'FORCE_UNREAD_STATUS':
      return {...state, forceUnread: action.unread};

    default:
      return state;
  }
};