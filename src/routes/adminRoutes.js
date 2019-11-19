const Router = require('koa-router');
const checkAdmin = require('../middleware/checkAdmin');

const router = new Router({ prefix: '/admin' });

router.use(checkAdmin);

router.get('/users', async ctx => {
  try {
    const collection = ctx.db.collection('users');
    ctx.body = await collection.find(
      {
        role: { $ne: 'admin' },
      },
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

router.put('/user/:id/edit', async ctx => {
  try {
    const {
      firstName,
      lastName,
      position,
      role,
    } = ctx.request.body;

    const { id } = ctx.params;

    const dataForEdit = {
      firstName,
      lastName,
      position,
      role,
    };

    Object.keys(dataForEdit).forEach(key => {
      if (!dataForEdit[key]) {
        delete dataForEdit[key];
      }
    });

    const collection = ctx.db.collection('users');
    const { value } = await collection.findOneAndUpdate(
      {
        _id: ctx.ObjectID(id),
      },
      {
        $set: dataForEdit,
      },
      {
        returnOriginal: false,
        projection: { _id: 0, password: 0 }
      },
    );

    ctx.body = value;
  } catch (err) {
    ctx.throw(500, err);
  }
});

module.exports = router;
