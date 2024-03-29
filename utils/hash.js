const bcrypt = require("bcrypt");

async function hash(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

async function compare(password, hashed) {
  return await bcrypt.compare(password, hashed);
}

module.exports = { hash, compare };
