const { MongoClient } = require('mongodb');
const { mongodb: { server, port, name } } = require('./config');

module.exports = MongoClient.connect(
  `mongodb://${server}:${port}/`,
  { useUnifiedTopology: true }
)
  .then(client => {
    console.log('MongoDB connected');
    return client.db(name);
  })
  .catch(err => console.log(err));
