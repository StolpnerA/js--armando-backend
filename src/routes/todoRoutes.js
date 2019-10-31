const Router = require('koa-router');
const checkAuth = require('../middleware/checkAuth');

const router = new Router({ prefix: '/todo' });

router.use(checkAuth);

router.get('/task/:taskId', async ctx => {
  try {
    const { taskId } = ctx.params;
    const collection = ctx.db.collection('todo');
    ctx.body = await collection.find(
      { taskId },
      { projection: { taskId: 0 } }
    ).toArray();
  } catch (err) {
    ctx.throw(500, err);
  }
});

router.post('/task/:taskId', async ctx => {
  try {
    const { taskId } = ctx.params;
    const { description } = ctx.request.body;
    const currentTime = new Date();

    const collection = ctx.db.collection('todo');
    const { ops: [ todo ] } = await collection.insertOne({
      taskId,
      description,
      createdAt: currentTime,
      changedAt: currentTime,
      status: false,
    });

    delete todo.taskId;
    ctx.body = todo;
  } catch (err) {
    ctx.throw(500, err);
  }
});

module.exports = router;
