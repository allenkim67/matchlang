const { Model } = require('objection');
const User = require('./user');

module.exports = class GroupUser extends Model {
  static tableName = 'group_users';

  static relationMappings = {
    user: {
      relation: Model.HasOneRelation,
      modelClass: User,
      join: {
        from: 'group_users.id',
        to: 'users.id'
      }
    }
  };
};