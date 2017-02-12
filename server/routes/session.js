const router = require('express').Router();
const _ = require('lodash');
const bcrypt = require('bcrypt-nodejs');
const User = require('../models/user');
const auth = require('../auth');
const logger = require('../logger');
const userValidator = require('../../app/validators/user');
const sessionValidator = require('../../app/validators/session');

router.post('/signup', async (req, res) => {
  const v = await userValidator.validateCreate(req.body);

  if (v.isValid) {
    try {
      const user = await User.create(v.cleanData);
      const userToken = _.pick(user, ['id', 'username']);
      auth.writeToken(userToken, res);
      res.send(user);
    } catch (err) {
      logger.debug(err);
      if (/username.*?already exists/.test(err.detail)) {
        res.status(400).send({field: 'username', message: 'username already exists'});
      }
    }
  } else {
    res.status(400).send(v.errors);
  }
});

router.post('/login', async (req, res) => {
  try {
    console.log('loginfjsjdlfsd');
  const v = await sessionValidator.validateLogin(req.body);

  if (!v.isValid) {
    res.status(400).send(v.errors);
  } else {
    const user = await User
      .query()
      .whereRaw('lower(username) = ?', v.cleanData.username.toLowerCase())
      .limit(1)
      .first()
      .eager('[learningLangs, speakingLangs]');

    if (!user || !bcrypt.compareSync(v.cleanData.password, user.password)) {
      res.status(400).send({field: 'password', message: 'invalid username or password'});
    } else {
      auth.writeToken(_.pick(user, ['id', 'username']), res);
      res.send(user);
    }
  }
  } catch (err) {
    console.log(err)
  }
});

router.post('/logout', (req, res) => {
  auth.clearToken(res);
  res.status(200).send('success');
});

router.get('/available/:username', async (req, res) => {
  const user = await User
    .query()
    .whereRaw('lower(username) = ?', req.params.username.toLowerCase())
    .limit(1)
    .first();

  res.send(!user);
});

module.exports = router;