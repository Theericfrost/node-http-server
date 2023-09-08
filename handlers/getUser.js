const { sendJsonResponse, parseUrlParams, isValidUuid } = require("../utils");

const getUser = (req, res, db) => {
  const { userId } = parseUrlParams(req.url);
  const user = db[userId];
  if (!isValidUuid(userId)) {
    sendJsonResponse(res, 400, { message: "Invalid userId" });
  } else if (!user) {
    sendJsonResponse(res, 404, { message: `User with id ${userId} not found` });
  } else {
    sendJsonResponse(res, 200, user);
  }
};

module.exports = getUser;
