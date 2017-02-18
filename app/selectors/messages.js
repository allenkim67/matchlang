import { createSelector } from 'reselect'
import { currentConvo, currentConvoType } from './convos'
import mapValues from 'lodash/mapValues'
import update from 'immutability-helper'
import values from 'lodash/values'

const messages = state => state.messages.messages;

export const messagesSelector = createSelector(
  messages,
  currentConvo,
  currentConvoType,
  (messages, currentConvo, convoType) => {
    if (convoType !== 'group') return messages;

    const addAdmin = m => {
      const isAdmin = !!currentConvo.groupUsers.find(u => u.admin && u.user_id === m.sender.id);
      return update(m, {sender: {admin: {$set: isAdmin}}});
    };
    return {
      parentOrder: messages.parentOrder,
      parents: mapValues(messages.parents, addAdmin),
      children: mapValues(messages.children, addAdmin)
    };
  }
);

export const parentMessages = createSelector(
  messagesSelector,
  messages => values(messages.parentOrder.map(i => messages.parents[i])).reverse()
);