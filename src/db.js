const { MongoClient } = require('mongodb');
const {
  mongodbDev: { server: serverDev, port, name: nameDev },
  mongodb: { server, name }
} = require('./config');

const url = process.env.NODE_ENV === 'dev'
  ? `mongodb://${serverDev}:${port}/`
  : process.env.MONGODB_URI;

console.log(process.env.MONGODB_URI);

const dbName = process.env.NODE_ENV === 'dev'
  ? nameDev
  : name;

module.exports = MongoClient.connect(
  url,
  { useUnifiedTopology: true }
)
  .then(client => {
    console.log('MongoDB connected');
    return client.db(dbName);
  })
  .catch(err => console.log(err));
