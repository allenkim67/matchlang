import pick from 'lodash/pick'
import reject from 'lodash/reject'
import omitBy from 'lodash/omitBy'
import trim from 'lodash/trim'
import config from '../../global-config'

const compactLangs = langs => reject(langs, l => l.lang === '');

function cleanLearningLangs(langs) {
  return langs ?
    compactLangs(langs).map(l => pick(l, ['id', 'lang', 'level'])) :
    null;
}

function cleanSpeakingLangs(langs) {
  return langs ?
    compactLangs(langs).map(l => pick(l, ['id', 'lang'])) :
    null;
}

module.exports = {
  validateCreate(data) {
    data.username = trim(data.username);

    const errors = [];

    ['username', 'password', 'email'].forEach(attr => {
      if (!data[attr] || data[attr] === '') {
        errors.push({field: attr, message: `${attr} cannot be blank`});
      }
    });

    if (data.username && data.username.length && !/^[a-zA-Z0-9_-]+$/.test(trim(data.username))) {
      errors.push({field: 'username', message: 'username can only contain letters, numbers, "-", and "_"'});
    }

    if (data.password && data.password.length && data.password.length < 8) {
      errors.push({field: 'password', message: 'password must be at least 8 characters long'})
    }

    return {
      errors,
      isValid: errors.length === 0,
      cleanData: {
        user: omitBy(pick(data, ['emailsub', 'username', 'password', 'email', 'location', 'description', 'birthdate']), (v, k) => v === ''),
        learningLangs: cleanLearningLangs(data.learningLangs),
        speakingLangs: cleanSpeakingLangs(data.speakingLangs)
      }
    }
  },

  validateUpdate(data) {
    const errors = [];

    if (data.email === '') {
      errors.push({field: 'email', message: 'email cannot be blank'});
    }

    if (data.price < config.minPrice) {
      errors.push({field: 'price', message: `price must be at least ${config.minPrice}`});
    }

    return {
      errors,
      isValid: errors.length === 0,
      cleanData: {
        user: omitBy(pick(data, ['email', 'location', 'description', 'birthdate', 'teacher', 'price']), (v, k) => v === '' && k === 'birthdate'),
        learningLangs: cleanLearningLangs(data.learningLangs),
        speakingLangs: cleanSpeakingLangs(data.speakingLangs)
      }
    }
  }
};