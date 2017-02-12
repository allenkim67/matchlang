const initialState = {
  count: 0,
  users: [],
  onlineUsers: new Set(),
  loading: false
};

export default (state=initialState, action) => {
  switch (action.type) {
    case 'FETCH_USERS_START':
      return {...state, loading: true, users: [], count: 0};
    case 'FETCH_USERS_SUCCESS':
      return {...state, loading: false, users: action.users, count: action.count};

    case 'SET_ONLINE_USERS':
      return {...state, onlineUsers: new Set(action.onlineUsers)};
    case 'UPDATE_USER_ONLINE':
      state.onlineUsers.add(action.userId);
      return {...state, onlineUsers: new Set(state.onlineUsers)};
    case'UPDATE_USER_OFFLINE':
      state.onlineUsers.delete(action.userId);
      return {...state, onlineUsers: new Set(state.onlineUsers)};

    default:
      return state;
  }
};