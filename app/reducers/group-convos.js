import update from 'immutability-helper'
import findIndex from 'lodash/findIndex'

const initialState = {
  loading: false,
  chatType: 'upcoming',
  groupConvos: [],
  scheduledConvos: [],
  count: 0
};

export default (state=initialState, action) => {
  switch (action.type) {
    case 'FETCH_GROUP_CONVOS_START':
      return {...state, loading: true};
    case 'FETCH_GROUP_CONVOS_SUCCESS':
      const convoType = action.scheduled ? 'scheduledConvos' : 'groupConvos';
      return {
        ...state,
        loading: false,
        [convoType]: action.convos,
        count: action.count
      };
    case 'CREATE_GROUP_CONVO_START':
      return {...state, loading: true};
    case 'TOGGLE_CHAT_TYPE':
      return {...state, chatType: action.chatType};
    default:
      return state;
  }
}