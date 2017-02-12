import session from './session'
import convos from './convos'
import users from './users'
import review from './review'
import messages from './messages'
import groupConvos from './group-convos'

export default function(state={}, action) {
  return {
    session: session(state.session, action),
    convos: convos(state.convos, action),
    users: users(state.users, action),
    review: review(state.review, action),
    messages: messages(state.messages, action),
    groupConvos: groupConvos(state.groupConvos, action)
  }
};