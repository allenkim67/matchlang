const router = require('express').Router();
const User = require('../models/user');
const GroupConvo = require('../models/group-convo');
import validator from '../../app/validators/user'
import config from '../../global-config'
const auth = require('../auth');

router.get('/self', auth.middleware, async (req, res) => {
  const user = await User
    .query()
    .where({id: req.authUser.id})
    .limit(1)
    .first();

  res.send(user);
});

router.get('/profile/:username', async (req, res) => {
  const user = await User
    .query()
    .select(['id', 'username', 'location', 'description', 'birthdate', 'last_active'])
    .where({username: req.params.username})
    .eager('[learningLangs, speakingLangs]')
    .first();

  if (user) {
    user.groupConvos = await GroupConvo.findByAdminId(user.id);
  }

  res.send(user);
});

router.get('/', async (req, res) => {
  const limit = req.query.limit || config.usersPerPage;
  const offset = req.query.offset * limit;
  const conditions = req.query.filters ? JSON.parse(req.query.filters) : {};

  const users = await User.findAll({
    limit,
    offset,
    conditions
  });

  res.send(users);
});

router.get('/count', async (req, res) => {
  const conditions = req.query.filters ? JSON.parse(req.query.filters) : {};
  const count = await User.count(conditions);
  res.send(count[0].count);
});

router.get('/:id', async (req, res) => {
  const user = await User
    .query()
    .where({id: req.params.id});

  res.send(user);
});

router.put('/', auth.middleware, async (req, res) => {
  const v = validator.validateUpdate(req.body);

  if (v.isValid) {
    const user = await User.update(req.authUser.id, v.cleanData);
    res.send(user);
  } else {
    res.send(v.errors);
  }
});

router.put('/reload', auth.middleware, async (req, res) => {
  await User
    .query()
    .update({credits: req.body.amount})
    .where({id: req.authUser.id});

  res.sendStatus(200);
});

router.put('/active', auth.middleware, async(req, res) => {
  await User.updateLastActive(req.authUser.id);

  res.sendStatus(200);
});

module.exports = router;