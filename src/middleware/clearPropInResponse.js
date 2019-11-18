module.exports = async (ctx, next) => {
  await next();

  if ('password' in ctx.response.body.user) {
    delete ctx.response.body.user.password;
  }

  if ('_id' in ctx.response.body.user) {
    delete ctx.response.body.user._id;
  }
};
