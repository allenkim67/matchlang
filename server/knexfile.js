module.exports = {
  client: 'postgresql',
  connection: process.env.DATABASE_URL || {database: 'chat_dev'}
};