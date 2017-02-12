import update from 'immutability-helper'
import deepcopy from 'deepcopy'
import findIndex from 'lodash/findIndex'
import merge from 'lodash/merge'

const initialState = {
  loading: false,
  messages: {
    parentOrder: [],
    parents: {},
    children: {}
  }
};

export default function(state=initialState, action) {
  switch (action.type) {
    case 'FETCH_MESSAGES_START':
      return {
        loading: action.reset ? true : false,
        messages: action.reset ? initialState.messages : state.messages
      };

    case 'FETCH_MESSAGES_SUCCESS':
      return {
        loading: false,
        messages: action.reset ? action.messages : {
          parentOrder: action.messages.parentOrder.concat(state.messages.parentOrder),
          parents: merge(action.messages.parents, state.messages.parents),
          children: merge(action.messages.children, state.messages.children)
        }
      };

    case 'ADD_MESSAGE':
      const keyOrId = action.message.key || action.message.id;

      if (action.message.parent_id) {
        return {
          ...state,
          messages: {
            parentOrder: state.messages.parentOrder,
            parents: update(state.messages.parents, {[action.message.parent_id]: {messages: {$push: [keyOrId]}}}),
            children: update(state.messages.children, {[keyOrId]: {$set: action.message}})
          }
        }
      } else {
        return {
          ...state,
          messages: {
            parentOrder: state.messages.parentOrder.concat(keyOrId),
            parents: update(state.messages.parents, {[keyOrId]: {$set: action.message}}),
            children: state.messages.children
          }
        }
      }

    case 'UPDATE_MESSAGE':
      const messagesCopy = deepcopy(state.messages);

      if (action.message.parent_id) {
        if (!messagesCopy.children[action.message.id]) {
          const parent = messagesCopy.parents[action.message.parent_id];
          const i = findIndex(parent.messages, id => id === action.key);

          parent.messages.splice(i, 1, action.message.id);
          delete messagesCopy.children[action.key];
        }

        return {
          ...state,
          messages: {
            ...messagesCopy,
            children: update(messagesCopy.children, {[action.message.id]: {$set: action.message}})
          }
        }
      } else {
        if (!messagesCopy.parents[action.message.id]) {
          const i = findIndex(messagesCopy.parentOrder, id => id === action.key);

          messagesCopy.parentOrder.splice(i, 1, action.message.id);
          delete messagesCopy.parents[action.key];
        }
        
        return {
          ...state,
          messages: {
            ...messagesCopy,
            parents: update(messagesCopy.parents, {[action.message.id]: {$set: action.message}})
          }
        }
      }

    default:
      return state;
  }
}