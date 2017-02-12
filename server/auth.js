const jwt = require('jsonwebtoken');
const logger = require('./logger');

const secret = 'correctbatteryhorsestapler';

module.exports = {
  writeToken(payload, res) {
    res.cookie('auth', jwt.sign(payload, secret));
  },

  clearToken(res) {
    res.clearCookie('auth');
  },

  verify: token => {
    try {
      return jwt.verify(token, secret);
    } catch (err) {
      if (err.name === 'JsonWebTokenError') {
        return null;
      } else {
        throw err;
      }
    }
  },

  middleware: function(req, res, next) {
    if (req.cookies.auth) {
      try {
        req.authUser = jwt.verify(req.cookies.auth, secret);
      } catch (err) {
        res.clearCookie('auth');
        logger.debug(err);
        res.status(500).send('error error!');
      }
      next();
    } else {
      res.status(500).send('error error!');
    }
  }
};