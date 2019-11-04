const jwt = require('jsonwebtoken');

const { jwt: { user: { secret, header } } } = require('../config.json');

module.exports = async (ctx, next) => {
  try {
    ctx.state.user = jwt.verify(ctx.headers[header], secret);
    ctx.state.userId = ctx.state.user.userId;

    const collection = ctx.db.collection('users');
    const user = await collection.findOne({
      _id: ctx.ObjectID(ctx.state.userId),
      role: 'admin',
    });

    if (!user) {
      ctx.throw(403);
    }

    await next();
  } catch (err) {
    console.log(err);
    if (err.message === 'jwt malformed') {
      ctx.throw(401, 'User not authorization');
    }
    ctx.throw(401, err);
  }
};
