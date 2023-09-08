const { sendJsonResponse } = require("../utils");
const { v4: uuid } = require("uuid");
const cluster = require("cluster");
const createUser = (req, res, db) => {
  let data = "";
  req.on("data", (chunk) => {
    data += chunk.toString();
  });
  req.on("end", () => {
    const { username, age, hobbies = [] } = JSON.parse(data);
    if (!username || !age) {
      sendJsonResponse(res, 400, {
        message: "Username and age are required fields",
      });
    } else {
      const id = uuid();
      const newUser = { id, username, age, hobbies };
      db[id] = newUser;
      sendJsonResponse(res, 201, newUser);
      if (cluster.isWorker) {
        process.send(db);
      }
    }
  });
};

module.exports = createUser;
