import { createSelector } from 'reselect'
import { currentUserSelector, currentUserId } from './session'
import values from 'lodash/values'
import concat from 'lodash/concat'
import reduce from 'lodash/reduce'

const convos = state => state.convos.convos;

const currentPartnerId = state => state.convos.currentPartnerId;

const currentConvoId = state => state.convos.currentConvoId;

const typers = state => state.convos.typers;

export const findConvoByKey = (state, {convoType, id}) => {
  return state.convos.convos[convoType].convos[id];
};

export const findConvoByConvoId = (state, {convoType, id}) => {
  return values(state.convos.convos[convoType].convos).find(c => c.id === id);
};

export const currentConvoType = createSelector(
  currentPartnerId,
  currentConvoId,
  (partnerId, convoId) => {
    if (partnerId) return 'private';
    if (convoId) return 'group';
    return null;
  }
);

export const currentId = createSelector(
  currentPartnerId,
  currentConvoId,
  (partnerId, convoId) => partnerId || convoId
);

export const keyedCurrentConvos = createSelector(
  convos,
  currentConvoType,
  (convos, convoType) => convos[convoType]
);

export const currentConvo = createSelector(
  keyedCurrentConvos,
  currentId,
  (convos, id) => convos && id ? convos.convos[id] : null
);

export const typerNames = createSelector(
  typers,
  currentConvoType,
  currentId,
  currentUserSelector,
  currentPartnerId,
  (typers, convoType, currentId, currentUser, partnerId) => {
    return reduce(typers, (result, t, name) => {
      const sameConvo = t.convoType === convoType && (
        (convoType === 'group' && t.currentId === currentId) ||
        (convoType === 'private' && t.currentId === currentUser.id && t.userId === partnerId)
      );

      if (sameConvo && currentUser.username !== name) {
        result.push(name);
      }
      return result;
    }, []);
  }
);

export const totalUnread = createSelector(
  convos,
  convos => {
    const numUnread = cs => values(cs).filter(c => c.unread).reduce((acc, c) => acc + c.unread, 0);
    return numUnread(convos.group.convos) + numUnread(convos.private.convos);
  }
);

export const orderedPrivate = createSelector(
  convos,
  convos => {
    return convos.private.order.map(id => convos.private.convos[id]);
  }
);