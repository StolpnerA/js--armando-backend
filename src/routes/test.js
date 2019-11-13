const Router = require('koa-router');

const router = new Router({ prefix: '/test' });

router.get('/', async ctx => {
  ctx.body = 'test';
});

module.exports = router;
