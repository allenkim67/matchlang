const router = require('express').Router();
const Message = require('../models/message');
const Favorite = require('../models/favorite');
const _ = require('lodash');
const auth = require('../auth');
const logger = require('../logger');
const translateClient = require('@google-cloud/translate')({key: process.env.GOOGLE_TRANSLATE_KEY});

router.get('/favorites', auth.middleware, async (req, res) => {
  const messages = await Message.favorites(req.authUser.id);
  res.send(messages);
});

router.get('/:convoType/:convoId', async (req, res) => {
  try {
    const authUser = auth.verify(req.cookies.auth);
    if (req.params.convoType === 'private' && !authUser) {
      throw {message: 'UNAUTHORIZED'}
    }

    const messages = await Message.fetch({
      convoType: req.params.convoType,
      convoId: req.params.convoId,
      offset: req.query.offset || 0,
      authUserId: authUser ? authUser.id : null
    });

    res.send(messages);
  } catch (err) {
    logger.debug(err);
    if (err.message === 'UNAUTHORIZED') {
      res.status(400).send({message: 'Error: Could not fetch messages. Unauthorized'});
    }
  }
});

router.post('/translate', async (req, res) => {
  translateClient.translate(req.body.content, req.body.lang, (err, translated) => {
    if (err) logger.debug(err);
    res.send(translated);
  });
});

router.post('/favorite/:id', auth.middleware, async (req, res) => {
  if (req.body.status) {
    await Favorite
      .query()
      .insert({
        user_id: req.authUser.id,
        message_id: req.params.id
      });
  } else {
    await Favorite
      .query()
      .delete()
      .where({
        user_id: req.authUser.id,
        message_id: req.params.id
      });
  }

  res.send(true);
});

router.post('/:convoType', auth.middleware, async (req, res) => {
  const cleanData = {
    ..._.pick(req.body, ['convo_id', 'content', 'parent_id']),
    sender_id: req.authUser.id,
    convo_type: req.params.convoType
  };

  try {
    res.send(await Message.addMessage(cleanData));
  } catch (err) {
    logger.debug(err);
    res.status(400).send(err);
  }
});

router.put('/:messageId', auth.middleware, async (req, res) => {
  const m = await Message.query().where({id: req.params.messageId}).first();

  let updateData = {tag: req.body.tag};

  if (req.body.content) {
    if (m.sender_id === req.authUser.id) {
      updateData = {...updateData, content: req.body.content}
    } else {
      res.status(400).send('unauthorized message update; not sender');
    }
  }

  const convoAuthorized = m
    .$relatedQuery('convo')
    .where({teacher_id: req.authUser.id})
    .orWhere({student_id: req.authUser.id})
    .first();

  if (m.convo_type === 'group' || await convoAuthorized) {
    const message = await Message
      .query()
      .updateAndFetchById(req.params.messageId, updateData);

    res.send(message);
  } else {
    res.status(400).send('unauthorized message update; not convo member');
  }
});

module.exports = router;