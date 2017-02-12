import { createSelector } from 'reselect'
import { currentConvo } from './convos'
import { forceUnreadSelector } from './session'

export const titleSelector = createSelector(
  currentConvo,
  forceUnreadSelector,
  (currentConvo, forceUnread) => {
    const hasUnread = false;
    const name = currentConvo ? currentConvo.name : null;
    const defaultTitle = 'MatchLang - Chat with language teachers and friends!';
    const title = name ? `${name} | ${defaultTitle}` : defaultTitle;
    return forceUnread || hasUnread ? `* ${title}` : title;
  }
);