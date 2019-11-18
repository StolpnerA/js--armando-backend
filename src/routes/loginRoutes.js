const Router = require('koa-router');
const bcrypt = require('bcryptjs');

const createToken = require('../helpers/createToken');
const clearPropInResponse = require('../middleware/clearPropInResponse');

const router = new Router({ prefix: '/auth' });

router.use(clearPropInResponse);

router.post('/registration', async ctx => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      position,
    } = ctx.request.body;

    const collection = ctx.db.collection('users');
    const users = await collection
      .find({ email })
      .toArray();

    if (users.length !== 0) ctx.throw(400, 'Such user already exists');

    const passwordHash = await bcrypt.hash(password, 8);
    const { ops: [ user ], insertedId } = await collection.insertOne({
      email,
      password: passwordHash,
      firstName,
      lastName,
      position,
      role: 'user',
    });

    const token = createToken(insertedId);
    ctx.body = { token, user };
  } catch (err) {
    ctx.throw(500, err);
  }
});

router.post('/authorization', async ctx => {
  try {
    const {
      email,
      password,
    } = ctx.request.body;

    const collection = ctx.db.collection('users');
    const user = await collection.findOne({ email });

    if (!user) ctx.throw(401, 'Check email and password');

    const isCorrectPassword = await bcrypt.compare(password, user.password);

    if (!isCorrectPassword) ctx.throw(401, 'Check email and password');

    const token = createToken(user._id);
    ctx.body = { token, user };
  } catch (err) {
    ctx.throw(500, err);
  }
});

module.exports = router;
