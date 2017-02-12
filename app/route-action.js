let routeTo;

if (process.env.PLATFORM === 'web') {
  const browserHistory = require('react-router').browserHistory;
  routeTo = route => browserHistory.push(route);
} else {
  const Actions = require('react-native-router-flux').Actions;
  routeTo = (route, params, title) => {
    const routeParams = {routeParams: params};
    if (title) routeParams.title = title;
    Actions[route](routeParams);
  }
}

export default routeTo;