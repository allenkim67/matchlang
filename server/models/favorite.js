const { Model } = require('objection');

module.exports = class Favorite extends Model {
  static tableName = 'favorites';

  static get relationMappings() {
    return {
      message: {
        relation: Model.BelongsToOneRelation,
        modelClass: require('./message'),
        join: {
          from: 'messages.id',
          to: 'favorites.message_id'
        }
      }
    }
  };
};