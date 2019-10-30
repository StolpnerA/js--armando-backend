const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const db = require('./db');
const { ObjectID } = require('mongodb');
const { app: { port } } = require('./config');
const router = require('./routes');

const app = new Koa();

app.use(bodyParser());

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log('\x1b[30;47m%s', `${ctx.method} ${ctx.url} - ${ms}`, '\x1b[0m');
});

app.use(router());

db.then(async database => {
  app.context.db = database;
  app.context.ObjectID = ObjectID;

  app.listen(port, () => {
    console.log(`Server running on localhost:${port}`);
  });
});

