const combineRouters = require('koa-combine-routers');

module.exports = combineRouters([
  require('./userRoutes'),
  require('./loginRoutes'),
  require('./taskRoutes'),
  require('./todoRoutes'),
  require('./adminRoutes'),
  require('./test'),
]);
