const router = require('express').Router();
const Convo = require('../../models/convo');

router.post('/:partnerId', async (req, res) => {
  const unread = req.body.unread || 0;

  const convo = await Convo
    .query()
    .findOrUpsert({user1_id: req.authUser.id, user2_id: +req.params.partnerId, unread});

  res.send(Convo.parseByMode(convo, req.authUser.id));
});

module.exports = router;