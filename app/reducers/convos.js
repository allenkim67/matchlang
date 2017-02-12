import update from 'immutability-helper'
import normalize from '../normalizers/convos'
import deepcopy from 'deepcopy'
import set from 'lodash/set'

const defaultConvos = {
  group: {order: [], convos: []},
  private: {order: [], convos: []}
};

const initialState = {
  currentPartnerId: null,
  currentConvoId: null,
  convos: typeof SESSION !== 'undefined' && SESSION.convos ? normalize(SESSION.convos) : defaultConvos,
  loading: false,
  typers: {}
};

export default (state=initialState, action) => {
  switch (action.type) {
    case 'FETCH_CONVOS_START':
      return {...state, loading: true};
    case 'FETCH_CONVOS_SUCCESS':
      return {...state, loading: false, convos: action.convos};

    case 'SET_CURRENT_CONVO':
      return {
        ...state,
        currentPartnerId: action.partnerId,
        currentConvoId: action.convoId,
        convos: update(state.convos, {
          [action.convoType]: {
            convos: {
              [action.partnerId || action.convoId]: {
                unread: {$set: 0},
                newlyCreated: {$set: false}
              }
            }
          }
        })
      };
    case 'CLEAR_CURRENT_CONVO':
      return {
        ...state,
        currentPartnerId: null,
        currentConvoId: null
      };

    case 'CREATE_CONVO':
      return {
        ...state,
        convos: update(state.convos, {
          [action.convoType]: {
            order: {$unshift: [action.id]},
            convos: {[action.id]: {$set: action.convo}}
          }
        })
      };

    case 'INCR_UNREAD':
      return {
        ...state,
        convos: update(state.convos, {
          [action.convoType]: {
            convos: {
              [action.id]: {
                unread: {$apply: n => n + 1}
              }
            }
          }
        })
      };

    case 'LOGOUT_SUCCESS':
      return {
        ...state,
        convos: {
          group: {order: [], convos: {}},
          private: {order: [], convos: {}}
        }
      };

    case 'CREATE_GROUP_CONVO_SUCCESS':
      return {
        ...state,
        convos: update(state.convos, {
          group: {
            order: {$unshift: [action.convo.id]},
            convos: {
              [action.convo.id]: {$set: action.convo}
            }
          }
        })
      };

    case 'LEAVE_GROUP_CONVO':
      const copy = deepcopy(state);
      copy.convos.group.order.splice(copy.convos.group.order.indexOf(action.id), 1);
      delete copy.convos.group.convos[action.id];
      return copy;

    case 'REORDER_CONVOS':
      const order = deepcopy(state.convos[action.convoType].order);
      return {
        ...state,
        convos: update(state.convos, {
          [action.convoType]: {
            order: {
              $set: [action.id].concat(order.filter(id => id !== action.id))
            }
          }
        })
      };

    case 'IS_TYPING': {
      const typers = deepcopy(state.typers);
      typers[action.user.username] = {
        userId: action.user.id,
        currentId: action.currentId,
        convoType: action.convoType
      };
      return {...state, typers};
    }

    case 'STOP_TYPING': {
      const typers = deepcopy(state.typers);
      delete typers[action.user.username];
      return {...state, typers};
    }

    default:
      return state;
  }
};