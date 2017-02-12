import { createSelector } from 'reselect'

export const currentUserSelector = state => state.session.user;
export const currentUserId = state => state.session.user.id;
export const forceUnreadSelector = state => state.session.forceUnread;