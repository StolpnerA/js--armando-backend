const Router = require('koa-router');
const checkAuth = require('../middleware/checkAuth');

const router = new Router({ prefix: '/user' });

router.use(checkAuth);

router.get('/', async ctx => {
  try {
    const collection = ctx.db.collection('users');
    ctx.body = await collection.findOne(
      {
        _id: ctx.ObjectID(ctx.state.userId)
      },
      {
        projection: { _id: 0, password: 0 }
      }
    );
  } catch (err) {
    ctx.throw(500, err);
  }
});

module.exports = router;
