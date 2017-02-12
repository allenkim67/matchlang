const { Model, QueryBuilder, transaction } = require('objection');
const path = require('path');
const bcrypt = require('bcrypt-nodejs');
const _ = require('lodash');

class Lang extends Model {
  static async sync(langs, user) {
    await this
      .query()
      .where({user_id: user.id})
      .whereNotIn('id', _.filter(_.map(langs, 'id'), _.identity))
      .del();
    
    return Promise.all(langs.map(model => {
      model = {...model, user_id: user.id};

      if (model.id) {
        return this.query().update(model).where('id', model.id).returning('*').first();
      } else {
        return this.query().insert(model).returning('*').first();
      }
    }));
  }
}

class LearningLang extends Lang {
  static tableName = 'learning_langs';
}

class SpeakingLang extends Lang {
  static tableName = 'speaking_langs';
}

module.exports = class User extends Model {
  static tableName = 'users';

  /*
     This function must be a get function and the Message class must be required
     here in order to prevent a circular dependency bug. Normally this is solved
     by using an absolute path string, but it breaks here because it circumvents
     webpack transpilation.
  */
  static get relationMappings() {
    return {
      learningLangs: {
        relation: Model.HasManyRelation,
        modelClass: LearningLang,
        join: {
          from: 'users.id',
          to: 'learning_langs.user_id'
        }
      },

      speakingLangs: {
        relation: Model.HasManyRelation,
        modelClass: SpeakingLang,
        join: {
          from: 'users.id',
          to: 'speaking_langs.user_id'
        }
      },

      sentMessages: {
        relation: Model.HasManyRelation,
        modelClass: require('./message'),
        join: {
          from: 'users.id',
          to: 'messages.sender_id'
        }
      },

      studentConvos: {
        relation: Model.HasManyRelation,
        modelClass: require('./convo'),
        join: {
          from: 'convos.student_id',
          to: 'users.id'
        }
      }
    }
  };

  static QueryBuilder = class extends QueryBuilder {
    findById(id) {
      return this.where({id}).first();
    }
  };

  $formatJson(json) {
    json = super.$formatJson(json);
    return _.omit(json, 'password');
  }

  static create(data) {
    async function welcomeMessage(user) {
      const convo = await user.$relatedQuery('studentConvos').insert({
        teacher_id: 1,
        price: 0,
        teacher_unread: 1,
        student_unread: 1
      });
      await convo.$relatedQuery('messages').insert({
        content: 'Hi and welcome! I\'m one of the creators of MatchLang, so if you have any problems or questions feel free to message me directly. Or we can just chat and I can help you with your English. :)',
        sender_id: 1
      });
    }

    return transaction(this, async User => {
      data.user.password = bcrypt.hashSync(data.user.password);
      const user = await User.query().returning('*').insert(data.user);

      await welcomeMessage(user);

      await user.$relatedQuery('learningLangs').insert(data.learningLangs);
      await user.$relatedQuery('speakingLangs').insert(data.speakingLangs);

      return user;
    });
  }

  static update(id, data) {
    return transaction(this, async User => {
      const user = await User.query().updateAndFetchById(id, data.user).eager('[learningLangs, speakingLangs]');

      if (data.learningLangs) user.learningLangs = await LearningLang.sync(data.learningLangs, user);
      if (data.speakingLangs) user.speakingLangs = await SpeakingLang.sync(data.speakingLangs, user);

      return user;
    });
  }

  static incrCredits(id, amount) {
    return User.query().increment('credits', amount).where({id});
  }

  static async updateLastActive(id) {
    return await this.query().update({'last_active': new Date()}).where({id});
  }

  static findAll({limit, offset, conditions}) {
    const columns = ['users.id', 'username', 'location', 'description', 'birthdate', 'last_active'];

    let query = this
      .query()
      .select(columns)
      .limit(limit)
      .offset(offset)
      .orderBy('last_active', 'desc')
      .leftJoinRelation('sentMessages')
      .count('sentMessages.id as sentMessages')
      .groupBy('users.id');

    if (conditions.learningLang) {
      query = query
        .leftJoinRelation('learningLangs')
        .where('learningLangs.lang', conditions.learningLang);
    }

    if (conditions.speakingLang) {
      query = query
        .leftJoinRelation('speakingLangs')
        .where('speakingLangs.lang', conditions.speakingLang);
    }

    return query.eager('[learningLangs, speakingLangs]');
  }

  static count(conditions) {
    let query = this
      .query()
      .leftJoinRelation('learningLangs')
      .leftJoinRelation('speakingLangs');

    if (conditions.learningLang) {
      query = query.where('learningLangs.lang', conditions.learningLang);
    }

    if (conditions.speakingLang) {
      query = query.where('speakingLangs.lang', conditions.speakingLang);
    }

    return query.countDistinct('users.id');
  }
};