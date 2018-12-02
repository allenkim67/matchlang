var envConfig;

if (process.env.NODE_ENV === 'production' || process.env.PLATFORM !== 'web') {
  envConfig = {
    webpackDevtool: null,
    messagesLimit: 50,
    baseUrl: 'http://matchlang.xyz',
    usersPerPage: 15,
    groupsPerPage: 15
  };
} else {
  envConfig = {
    webpackDevtool: 'eval-source-map',
    messagesLimit: 10,
    baseUrl: 'http://localhost:3000',
    usersPerPage: 6,
    groupsPerPage: 2
  };
}

const config = {
  firstMessageFee: 0,
  minDeposit: 500,
  minPrice: 0,
  freeMessages: 10
};

module.exports = Object.assign(config, envConfig);