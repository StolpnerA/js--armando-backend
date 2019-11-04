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

router.put('/:id', async ctx => {
  try {
    const { id } = ctx.params;
    const { description, status } = ctx.request.body;

    const collection = ctx.db.collection('todo');
    const { value: todo } = await collection.findOneAndUpdate(
      {
        _id: ctx.ObjectID(id),
      },
      {
        $set: {
          description,
          changedAt: new Date(),
          status,
        },
      },
      {
        projection: { taskId: 0 },
        returnOriginal: false,
      },
    );

    if (!todo) ctx.throw(400);

    ctx.body = todo;
  } catch (err) {
    ctx.throw(500, err);
  }
});

router.delete('/:id', async ctx => {
  try {
    const { id } = ctx.params;
    const collection = ctx.db.collection('todo');
    const { result } = await collection.deleteOne({ _id: ctx.ObjectID(id) });

    if (!result.ok || !result.n) ctx.throw(400);

    ctx.status = 200;
  } catch (err) {
     ctx.throw(500, err);
  }
});

module.exports = router;
