const { Model, transaction } = require('objection');
const User = require('./user');
const GroupUser = require('./group-user');
const _ = require('lodash');
const moment = require('moment');

module.exports = class GroupConvo extends Model {
  static tableName = 'group_convos';

  static relationMappings = {
    users: {
      relation: Model.ManyToManyRelation,
      modelClass: User,
      join: {
        from: 'group_convos.id',
        through: {
          from : 'group_users.group_convo_id',
          to: 'group_users.user_id'
        },
        to: 'users.id'
      }
    },

    groupUsers: {
      relation: Model.HasManyRelation,
      modelClass: GroupUser,
      join: {
        from: 'group_users.group_convo_id',
        to: 'group_convos.id'
      }
    }
  };

  static async count(scheduled) {
    const count = scheduled ?
      this.query().whereNotNull('start').where('start', '>', moment().subtract(6, 'hours')).count() :
      this.query().whereNull('start').orWhere('start', '<', moment().subtract(6, 'hours')).joinRelation('groupUsers').countDistinct('group_convos.id');

    return await count.whereNot('group_convos.id', 1);
  }

  static async findAll({scheduled, offset, limit}) {
    // nested eager query seems broken? Check for fix later.

    let groupConvos = scheduled ?
      this.query().whereNotNull('start').where('start', '>', moment().subtract(6, 'hours')).orderBy('start') :
      this.query().whereNull('start').orWhere('start', '<', moment().subtract(6, 'hours')).orderByRaw('start desc nulls last');

    groupConvos = await groupConvos
      .select('group_convos.*')
      .whereNot('group_convos.id', 1)
      .offset(offset)
      .limit(limit)
      .joinRelation('groupUsers')
      .count('groupUsers.id')
      .groupBy('group_convos.id')
      .eager('groupUsers');

    const ids = _.intersection(
      _.flatMap(groupConvos, groupConvo => _.map(groupConvo.groupUsers, 'user_id'))
    );

    const users = await User
      .query()
      .whereIn('id', ids);

    return groupConvos.map(c => {
      return {
        ...c,
        groupUsers: c.groupUsers.map(groupUser => {
          const user = users.find(user => user.id === groupUser.user_id);
          return {...groupUser, username: user.username}
        })
      }
    });
  }

  static findById(id) {
    return this
      .query()
      .where({id})
      .first();
  }

  static async create(convoData, authId) {
    const price = (await User.query().findById(authId)).price;

    return transaction(this, async GroupConvo => {
      const groupConvo = await GroupConvo
        .query()
        .returning('*')
        .insert({...convoData, price});

      await groupConvo
        .$relatedQuery('groupUsers')
        .insert({
          user_id: authId,
          admin: true
        });

      groupConvo.groupUsers[0].username = (await User.query().where({id: authId}).first()).username;

      return groupConvo;
    });
  }

  static findByUserId(id) {
    return this
      .query()
      .select('group_convos.*')
      .joinRelation('groupUsers')
      .where('groupUsers.user_id', '=', id)
      .orderBy('id', 'desc')
      .eager('[users, groupUsers]')
  }

  static findByAdminId(id) {
    return this
      .query()
      .select('group_convos.*')
      .joinRelation('groupUsers')
      .where('groupUsers.user_id', '=', id)
      .where({admin: true})
      .eager('groupUsers')
      .modifyEager('groupUsers', builder => builder
        .select(['group_users.*', 'users.username'])
        .join('users', 'users.id', 'group_users.user_id')
      );
  }

  static async join(convoId, authId=null) {
    let full = false;

    const groupConvoQuery = GroupConvo
      .query()
      .where({id: convoId})
      .first()
      .eager('users');

    const groupConvo = await groupConvoQuery;

    if (groupConvo.limit && groupConvo.limit <= groupConvo.users.length) {
      full = true;
    }

    if (!full && authId && !groupConvo.users.find(u => u.id === authId)) {
      await GroupUser
        .query()
        .insert({
          group_convo_id: groupConvo.id,
          user_id: authId
        });
    }

    const gc = await groupConvoQuery.eager('groupUsers');
    gc.full = full;
    return gc;
  }
};