const Router = require('koa-router');
const checkAuth = require('../middleware/checkAuth');
const bcrypt = require('bcryptjs');

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

router.put('/edit', async ctx => {
  try {
    const {
      password,
      firstName,
      lastName,
    } = ctx.request.body;

    const passwordHash = await bcrypt.hash(password, 8);

    const collection = ctx.db.collection('users');
    const { value } = await collection.findOneAndUpdate(
      {
        _id: ctx.ObjectID(ctx.state.userId),
      },
      {
        $set: {
          password: passwordHash,
          firstName,
          lastName,
        }
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
