const Router = require('koa-router');
const checkAdmin = require('../middleware/checkAdmin');

const router = new Router({ prefix: '/admin' });

router.use(checkAdmin);

router.get('/users', async ctx => {
  try {
    const collection = ctx.db.collection('users');
    ctx.body = await collection.find(
      {},
      {
        projection: { password: 0 },
      }
    ).toArray();
  } catch (err) {
    ctx.throw(500, err);
  }
});

router.get('/tasks/user/:id', async ctx => {
  try {
    const { id } = ctx.params;
    const collection = ctx.db.collection('tasks');
    ctx.body = await collection.find(
      {
        userId: id,
      },
      {
        projection: { userId: 0 },
      }
    ).toArray();
  } catch (err) {
    ctx.throw(500, err);
  }
});

module.exports = router;
