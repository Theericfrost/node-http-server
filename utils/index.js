const { v4: uuid } = require("uuid");

const sendJsonResponse = (res, statusCode, data) => {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
};

const sendEmptyResponse = (res, statusCode) => {
  res.statusCode = statusCode;
  res.end();
};

const parseUrlParams = (url) => {
  const userId = url.split("/")[3];

  return { userId };
};

const isValidUuid = (uuidString) => {
  return !!uuidString && uuidString.length === 36 && uuid(uuidString) !== null;
};

module.exports = {
  sendJsonResponse,
  sendEmptyResponse,
  parseUrlParams,
  isValidUuid,
};
