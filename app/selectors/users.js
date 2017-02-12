import { createSelector } from 'reselect'
import { currentUserSelector } from './session'
import sortBy from 'lodash/sortBy'
import reject from 'lodash/reject'

const users = state => state.users.users;

const onlineUsers = state => state.users.onlineUsers;

export const usersSelector = createSelector(
  users,
  onlineUsers,
  currentUserSelector,
  (users, onlineUsers, currentUser) => {
    users = users.map(u => {
      return {
        ...u,
        lastSeen: lastSeen(u),
        age: age(u),
        online: onlineUsers.has(u.id)};
    });

    return sortBy(
      reject(
        users,
        u => u.id == currentUser.id
      ),
      u => -Number(u.online)
    );
  }
);

function lastSeen(u) {
  const daysAgo = Math.ceil((new Date() - new Date(u.last_active)) / 86400000);
  return daysAgo === 1 ? 'today' : daysAgo + ' days ago';
}

function age(u) {
  if (!u.birthdate) return 0;

  const today = new Date();
  const birthDate = new Date(u.birthdate);
  const m = today.getMonth() - birthDate.getMonth();
  let age = today.getFullYear() - birthDate.getFullYear();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}