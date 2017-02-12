const { Model, QueryBuilder } = require('objection');
const User = require('./user');

module.exports = class Convo extends Model {
  static tableName = 'convos';

  static get relationMappings() {
    return {
      teacher: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'users.id',
          to: 'convos.teacher_id'
        }
      },

      student: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'users.id',
          to: 'convos.student_id'
        }
      },

      messages: {
        relation: Model.HasManyRelation,
        modelClass: require('./message'),
        join: {
          from: 'convos.id',
          to: 'messages.convo_id'
        }
      }
    }
  };

  static QueryBuilder = class extends QueryBuilder {
    async findOrUpsert({user1_id, user2_id, unread}) {
      const convo = await this
        .where({teacher_id: user1_id, student_id: user2_id})
        .orWhere({teacher_id: user2_id, student_id: user1_id})
        .first()
        .eager('[teacher, student]');

      if (convo) {
        const unreadKey = user1_id === convo.teacher.id ? 'teacher_unread' : 'student_unread';

        if (convo[unreadKey] != unread) {
          return this
            .update({[unreadKey]: unread})
            .where({id: convo.id})
            .returning('*')
            .eager('[teacher, student]');
        } else {
          return convo;
        }
      } else {
        return this
          .insert({teacher_id: user1_id, student_id: user2_id, teacher_unread: unread, price: 0})
          .eager('[teacher, student]')
      }
    }

    findById(id) {
      return this.where({id}).first();
    }
  };

  static async findAll(id) {
    const convos = await Convo
      .query()
      .select('convos.*')
      .join('messages', 'convos.id', 'messages.convo_id')
      .max('messages.sent_at')
      .where({teacher_id: id})
      .orWhere({student_id: id})
      .groupBy('convos.id')
      .orderBy('max', 'desc')
      .eager('[teacher, student]');

    return Convo.parseByMode(convos, id);
  }

  static async incrUnread({convo_id, authUserId}) {
    const convo = await Convo.query().where({id: convo_id}).first();

    let mode;
    if (convo.teacher_id === authUserId) {
      mode = 'student';
    } else if (convo.student_id === authUserId) {
      mode = 'teacher';
    } else {
      return;
    }

    return Convo
      .query()
      .where({id: convo_id})
      .increment(`${mode}_unread`, 1);
  }

  /*
    Unparsed convos have teacher_id, student_id, teacher_unread, student_unread.
    Since we know the current user we can reduce this to partner and unread.
   */
  static parseByMode(convos, currentUserId) {
    function parseConvo(convo) {
      const mode = convo.teacher.id === currentUserId ? 'teacher' : 'student';
      const partnerMode = mode === 'teacher' ? 'student' : 'teacher';

      return {
        name: convo[partnerMode].username,
        id: convo.id,
        users: [convo[partnerMode]],
        unread: convo[`${mode}_unread`],
        mode,
        price: convo.price
      };
    }

    if (!convos) return null;

    if (!Array.isArray(convos)) return parseConvo(convos);

    return convos.map(parseConvo);
  }
};