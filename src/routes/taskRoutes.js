const Router = require('koa-router');
const checkAuth = require('../middleware/checkAuth');

const router = new Router({ prefix: '/tasks' });

router.use(checkAuth);

router.get('/', async ctx => {
  try {
    const collection = ctx.db.collection('tasks');
    ctx.body = await collection.find({
      userId: ctx.state.userId,
    }, { projection: { userId: 0 } }).toArray();
  } catch (err) {
    ctx.throw(500, err);
  }
});

router.post('/', async ctx => {
  try {
    const { name } = ctx.request.body;
    const currentTime = new Date();

    const collection = ctx.db.collection('tasks');
    const { ops: [ task ] } = await collection.insertOne({
      userId: ctx.state.userId,
      name,
      createdAt: currentTime,
      changedAt: currentTime,
      status: false,
    });

    delete task.userId;
    ctx.body = task;
  } catch (err) {
    ctx.throw(500, err);
  }
});

router.put('/:id', async ctx => {
  try {
    const { id } = ctx.params;
    const { name } = ctx.request.body;
    const collection = ctx.db.collection('tasks');
    const { value: task } = await collection.findOneAndUpdate(
      {
        _id: ctx.ObjectID(id),
      },
      {
        $set: { name, changedAt: new Date() },
      },
      {
        projection: { userId: 0 },
        returnOriginal: false,
      },
    );

    if (!task) ctx.throw(400);

    ctx.body = task;
  } catch (err) {
    ctx.throw(500, err);
  }
});

module.exports = router;
