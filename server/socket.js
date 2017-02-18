const Bimap = require('../lib/bimap');
const Convo = require('./models/convo');
const GroupConvo = require('./models/group-convo');
const Device = require('./models/device');
const socketIo = require('socket.io');
const auth = require('./auth');
const _ = require('lodash');
const logger = require('./logger');
const fs = require('fs');
const moment = require('moment');
const gcm = require('node-gcm');

const sender = new gcm.Sender('AAAAqVS1miU:APA91bHsVuvTKHtHbtFhVh0Nt7R_hx9XYE_ETonQf6Q-iZgt4LAcQihZahAMLYlDN--FxpEd4LoK_ztMtpBserOIoT8y0ax25MT9614JDL0mHfoZHpAqtRIHYhO_24adrwJ3Oq6pj2Ck');

module.exports = http => {
  const io = socketIo(http);
  const socketMap = new Bimap();

  io.on('connection', socket => {
    function logout() {
      const userId = +socketMap.getKey(socket.id);
      socketMap.remove(userId, socket.id);
      if (!socketMap.getValue(userId)) {
        io.emit('user_offline', userId);
      }
    }

    function login(userId) {
      socketMap.push(userId, socket.id);
      socket.emit('online_users', socketMap.keys.map(id => +id));
      socket.broadcast.emit('user_online', userId);
    }

    socket.on('login', userId => {
      login(userId);
    });

    socket.on('disconnect', () => {
      logout();
    });

    socket.on('reconnect1', userId => {
      logout();
      login(userId);
    });

    socket.on('logout', () => {
      logout();
    });

    socket.on('register_mobile', async ({token, userId}) => {
      await Device.upsert({token, user_id: userId});
    });

    socket.on('message', async ({message, user}) => {
      //const user = auth.verify(authToken);
      let sids = [];

      if (message.convo_type === 'group') {
        const convo = await GroupConvo.findById(message.convo_id).eager('users');
        let userIds = convo.users.map(u => u.id);
        sids = _.compact(_.flatMap(userIds, id => socketMap.getValue(id)));
      } else {
        const convo = await Convo.query().findById(message.convo_id);
        const receiver_id = message.sender_id === convo.teacher_id ? convo.student_id : convo.teacher_id;
        const userId = message.sender_id !== user.id ? message.sender_id : receiver_id;
        sids = socketMap.getValue(userId) || [];

        sender.send(
          new gcm.Message({
            collapseKey: 'demo',
            priority: 'high',
            contentAvailable: true,
            timeToLive: 3,
            notification: {
              title: 'new message', body: message.content
            },
            data: {
              message: message.content
            }
          }),
          { registrationTokens: await Device.findByUserId(receiver_id) },
          () => {}
        );
      }

      if (sids.length) {
        sids.forEach(sid => socket.broadcast.to(sid).emit('message', message));
      } else if (!message.updated) {
        await Convo.incrUnread({
          convo_id: message.convo_id,
          authUserId: user.id
        });
      }
    });

    socket.on('is_typing', payload => {
      socket.broadcast.emit('user_is_typing', payload);
    });

    socket.on('stop_typing', payload => {
      socket.broadcast.emit('user_stop_typing', payload);
    });
  });

  setInterval(() => {
    const log = `${moment().format()} ${JSON.stringify(socketMap._keys)} \n`;
    fs.appendFile('server/public/watching.log', log, function(err) {
      if (err) console.log(err);
    });
  }, 600000);
};