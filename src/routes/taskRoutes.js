const Router = require('koa-router');
const checkAuth = require('../middleware/checkAuth');

const router = new Router({ prefix: '/tasks' });

router.use(checkAuth);

router.post('/', async ctx => {
  try {
    const { name } = ctx.request.body;
    const currentTime = new Date();

    const collection = ctx.db.collection('tasks');
    const { ops: [ task ] } = await collection.insertOne({
      name,
      createdAt: currentTime,
      changedAt: currentTime,
      todo: [],
      status: false,
    });

    ctx.body = task;
  } catch (err) {
    ctx.throw(500, err);
  }
});

module.exports = router;
