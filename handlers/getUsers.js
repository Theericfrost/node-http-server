const { sendJsonResponse } = require("../utils");

const getUsers = (req, res, db) => {
  const users = Object.values(db);
  sendJsonResponse(res, 200, users);
};

module.exports = getUsers;
