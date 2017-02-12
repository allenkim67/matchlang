import update from 'immutability-helper'
import findIndex from 'lodash/findIndex'

const initialState = {
  favs: [],
  loading: false
};

export default (state=initialState, action) => {
  switch (action.type) {
    case 'FETCH_FAVS_START':
      return {...state, loading: true};
    case 'FETCH_FAVS_SUCCESS':
      return {...state, loading: false, favs: action.favs};
    case 'UPDATE_SAVED':
      const messageIndex = findIndex(state.favs, m => m.id === action.message.id);
      return {...state, favs: update(state.favs, {$splice: [[messageIndex, 1, action.message]]})};
    default:
      return state;
  }
}