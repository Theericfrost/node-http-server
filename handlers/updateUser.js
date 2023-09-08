const cluster = require("cluster");
const { sendJsonResponse, parseUrlParams, isValidUuid } = require("../utils");

const updateUser = (req, res, db) => {
  const { userId } = parseUrlParams(req.url);
  let data = "";
  req.on("data", (chunk) => {
    data += chunk.toString();
  });
  req.on("end", () => {
    const { username, age, hobbies = [] } = JSON.parse(data);
    const user = db[userId];
    if (!isValidUuid(userId)) {
      sendJsonResponse(res, 400, { message: "Invalid userId" });
    } else if (!user) {
      sendJsonResponse(res, 404, {
        message: `User with id ${userId} not found`,
      });
    } else if (!username || !age) {
      sendJsonResponse(res, 400, {
        message: "Username and age are required fields",
      });
    } else {
      const userUpdated = { id: userId, username, age, hobbies };
      db[userId] = userUpdated;
      if (cluster.isWorker) {
        process.send(db);
      }

      sendJsonResponse(res, 200, userUpdated);
    }
  });
};

module.exports = updateUser;
