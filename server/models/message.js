const { Model, transaction } = require('objection');
const User = require('./user');
const Convo = require('./convo');
const Favorite = require('./favorite');
const config = require('../../global-config');
const _ = require('lodash');

module.exports = class Message extends Model {
  static tableName = 'messages';

  static get relationMappings() {
    return {
      convo: {
        relation: Model.BelongsToOneRelation,
        modelClass: Convo,
        join: {
          from: 'convos.id',
          to: 'messages.convo_id'
        }
      },

      sender: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'users.id',
          to: 'messages.sender_id'
        }
      },
      messages: {
        relation: Model.HasManyRelation,
        modelClass: Message,
        join: {
          from: 'messages.id',
          to: 'messages.parent_id'
        }
      }
    };
  }

  static findById(id) {
    return this
      .query()
      .where({id})
      .eager('messages')
      .modifyEager('messages', builder => builder.orderBy('sent_at').limit(1))
      .first();
  }

  static async fetch({convoType, convoId, offset, authUserId=null}) {
    if (convoType === 'private') {
      const convo = await Convo.query().findById(convoId);

      if (![convo.student_id, convo.teacher_id].includes(authUserId)) {
        throw new Error('UNAUTHORIZED');
      }
    }

    const selectProps = ['messages.id as id', 'convo_id', 'content', 'parent_id', 'sender_id', 'tag', 'convo_type', 'sent_at'];

    let messagesQuery = this
      .query()
      .select(authUserId ? [...selectProps, 'favorites.id as favorite'] : selectProps)
      .from('messages')
      .where({convo_type: convoType, convo_id: convoId, parent_id: null})
      .limit(config.messagesLimit)
      .offset(offset * config.messagesLimit)
      .orderBy('sent_at', 'desc')
      .eager('[messages, sender.speakingLangs]')
      .modifyEager('messages', builder => builder
        .select(selectProps)
        .orderBy('sent_at')
        .eager('sender')
      );

    if (authUserId) {
      const favorites = Favorite.query().where({user_id: authUserId}).as('favorites');
      messagesQuery = messagesQuery.leftJoin(favorites, 'messages.id', 'favorites.message_id')
    }

    return (await messagesQuery).reverse();
  }

  static addMessage(message) {
    return transaction(this, Convo, User, async (Message, Convo, User) => {
      //const convo = await Convo
      //  .query()
      //  .findById(message.convo_id)
      //  .eager('[teacher, student]');
      //
      //const sentByStudentCount = await Message.sentCount(convo.student.id, convo.id);
      //
      //if (message.sender_id === convo.teacher_id) {
      //  if (config.firstMessageFee && sentByStudentCount === 0) {
      //    if (convo.teacher.credits < config.firstMessageFee) {
      //      throw {message: 'Message not sent! You do not have enough credits to send the first message.'};
      //    }
      //
      //    await User.query().where({id: convo.teacher.id}).decrement('credits', config.firstMessageFee);
      //  }
      //} else if (message.sender_id === convo.student_id && sentByStudentCount > (config.freeMessages - 1)) {
      //  if (convo.student.credits < convo.price) throw {message: 'Message not sent! You do not have enough credits.'};
      //
      //  await User.query().where({id: convo.teacher.id}).increment('credits', convo.price);
      //  await User.query().where({id: convo.student.id}).decrement('credits', convo.price);
      //}
      const savedMessage = await Message.query().insert(message).eager('sender.speakingLangs');

      return {...savedMessage, messages: []};
    });
  }

  static async sentCount(id, convo_id) {
    const conditions = {convo_id: convo_id, sender_id: id};
    const sentByStudent = await Message
      .query()
      .countDistinct('id')
      .where(_.pickBy(conditions, _.identity))
      .first();

    return +sentByStudent.count;
  }

  static async favorites(userId) {
    const favorites = Favorite
      .query()
      .where({user_id: userId})
      .as('favorites');

    return this
      .query()
      .select('messages.*')
      .from('messages')
      .rightJoin(favorites, 'messages.id', 'favorites.message_id')
      .where({parent_id: null})
      .eager('[sender, messages.sender]');
  }
};