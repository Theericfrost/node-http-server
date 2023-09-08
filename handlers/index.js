const createUser = require("./createUser");
const deleteUser = require("./deleteUser");
const getUser = require("./getUser");
const getUsers = require("./getUsers");
const updateUser = require("./updateUser");
const dataBase = require('../db')

const { sendJsonResponse } = require("../utils");

const regularExpression = /^\/api\/users\/\w{8}-(\w{4}-){3}\w{12}$/;

const requestHandlers = (req, res, db = dataBase) => {
  try {
    if (req.method === "GET" && req.url === "/api/users") {
      getUsers(req, res, db);
    } else if (req.method === "GET" && regularExpression.test(req.url)) {
      getUser(req, res, db);
    } else if (req.method === "POST" && req.url === "/api/users") {
      createUser(req, res, db);
    } else if (req.method === "PUT" && regularExpression.test(req.url)) {
      updateUser(req, res, db);
    } else if (req.method === "DELETE" && regularExpression.test(req.url)) {
      deleteUser(req, res, db);
    } else {
      sendJsonResponse(res, 404, { message: "Route dosn't exist" });
    }
  } catch (e) {
    sendJsonResponse(res, 500, { message: "SMTH went wrong" });
  }
};

module.exports = requestHandlers;
