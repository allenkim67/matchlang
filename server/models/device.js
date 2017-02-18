const { Model } = require('objection');
const _ = require('lodash');

module.exports = class Device extends Model {
  static tableName = 'devices';

  static async findByUserId(id) {
    const devices = await this
      .query()
      .select(['token'])
      .where({user_id: id});

    return _.map(devices, 'token');
  }

  static async upsert(props) {
    props = _.pick(props, ['user_id', 'token']);
    let device = await this.query().where(props);
    if (device.length === 0) {
      device = this.query().insert(props);
    }
    return device;
  }
};