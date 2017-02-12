const router = require('express').Router();
const GroupConvo = require('../../models/group-convo');
const Convo = require('../../models/convo');
const auth = require('../../auth');

const groupConvos = require('./group-convos');
const privateConvos = require('./private-convos');

router.use('/group', groupConvos);
router.use('/private', auth.middleware, privateConvos);

router.get('/', auth.middleware, async (req, res) => {
  const groupConvos = await GroupConvo.findByUserId(req.authUser.id);
  const privateConvos = await Convo.findAll(req.authUser.id);
  res.send({groupConvos, privateConvos});
});

module.exports = router;