const combineRouters = require('koa-combine-routers');

module.exports = combineRouters([
  require('./loginRoutes'),
  require('./taskRoutes'),
]);
