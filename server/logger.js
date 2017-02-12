const winston = require('winston');

const tsFormat = () => (new Date()).toLocaleTimeString();

const logger = new (winston.Logger)({
  transports: [
    // colorize the output to the console
    new (winston.transports.Console)({
      timestamp: tsFormat,
      colorize: true,
      level: 'debug'
    }),
    new (winston.transports.File)({
      filename: 'debug.log',
      timestamp: tsFormat,
      level: 'debug'
    })
  ]
});

module.exports = logger;