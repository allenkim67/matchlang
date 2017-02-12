const router = require('express').Router();
const GroupConvo = require('../../models/group-convo');
const GroupUser = require('../../models/group-user');
const _ = require('lodash');
const auth = require('../../auth');
const config = require('../../../global-config');
const moment = require('moment');

router.get('/:type', async (req, res) => {
  const scheduled = req.params.type === 'scheduled';
  const limit = config.groupsPerPage;
  const offset = (req.query.offset || 0) * limit;

  const groups = await GroupConvo.findAll({scheduled, offset, limit});

  res.send(groups);
});

router.get('/:type/count', async (req, res) => {
  const scheduled = req.params.type === 'scheduled';
  const count = await GroupConvo.count(scheduled);
  res.send(count[0].count);
});

router.post('/', auth.middleware, async (req, res) => {
  const cleanData = _.pick(req.body, ['name', 'description', 'start', 'limit']);
  const groupConvo = await GroupConvo.create(cleanData, req.authUser.id);
  res.send(groupConvo);
});

router.post('/unjoin/:convoId', auth.middleware, async (req, res) => {
  await GroupUser
    .query()
    .where({user_id: req.authUser.id, group_convo_id: req.params.convoId})
    .del();

  res.send(200);
});

router.post('/:convoId', async (req, res) => {
  const authUser = auth.verify(req.cookies.auth);
  const groupConvo = await GroupConvo.join(req.params.convoId, authUser ? authUser.id : null);
  res.send(groupConvo);
});

module.exports = router;