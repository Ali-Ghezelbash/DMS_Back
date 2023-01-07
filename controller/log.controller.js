var Log = require("../models/log.model");

async function getAllLog() {
  return await Log.findAll();
}

async function createLog(log) {
  return await Log.create(log);
}

async function updateLog(log) {
  return await Log.update(log, {
    where: { id: log.id },
  });
}

async function deleteLog(id) {
  return await Log.destroy({
    where: { id },
  });
}

module.exports = {
  getAllLog,
  createLog,
  updateLog,
  deleteLog,
};
