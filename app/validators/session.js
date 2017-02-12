import pick from 'lodash/pick'
import trim from 'lodash/trim'

module.exports = {
  validateLogin(data) {
    data.username = trim(data.username);

    const errors = [];

    ['username', 'password'].forEach(attr => {
      if (!data[attr] || data[attr] === '') {
        errors.push({field: attr, message: `${attr} cannot be blank`});
      }
    });

    return {
      errors,
      isValid: errors.length === 0,
      cleanData: pick(data, ['username', 'password'])
    }
  }
};