const cluster = require("cluster");
const {
  sendJsonResponse,
  parseUrlParams,
  sendEmptyResponse,
  isValidUuid,
} = require("../utils");

const deleteUser = (req, res, db) => {
  const { userId } = parseUrlParams(req.url);
  const user = db[userId];
  if (!isValidUuid(userId)) {
    sendJsonResponse(res, 400, { message: "Invalid userId" });
  } else if (!user) {
    sendJsonResponse(res, 404, { message: `User with id ${userId} not found` });
  } else {
    delete db[userId];
    sendEmptyResponse(res, 204);
    if (cluster.isWorker) {
      process.send(db);
    }
  }
};

module.exports = deleteUser;
