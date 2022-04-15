const jwt = require('jsonwebtoken');

const SYSTEM_TIME = '2022-03-31T19:19:35.515Z';
function makeToken(id) {
  return jwt.sign({ id }, process.env.SESSION_SECRET, { expiresIn: 86400 });
}

module.exports = {
  SYSTEM_TIME,
  makeToken,
};
