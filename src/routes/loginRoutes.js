const Router = require('koa-router');
const bcrypt = require('bcryptjs');

const createToken = require('../helpers/createToken');

const router = new Router({ prefix: '/auth' });

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

    if (users.length !== 0) ctx.throw(400, 'Such user is already registered');
    const passwordHash = await bcrypt.hash(password, 8);
    const { insertedId } = await collection.insertOne({
      email,
      password: passwordHash,
      firstName,
      lastName,
      position,
      role: 'admin',
    });
    const token = createToken(insertedId);
    ctx.body = { token };
  } catch (err) {
    ctx.throw(500, err);
  }
});

module.exports = router;
