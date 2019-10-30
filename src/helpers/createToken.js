const jwt = require('jsonwebtoken');
const { jwt: { user: configJwtUser } } = require('../config.json');

module.exports = userId =>
  jwt.sign({ userId }, configJwtUser.secret, {
    expiresIn: configJwtUser.expiresIn
  });
