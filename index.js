const http = require("http");
require("dotenv").config();
const requestHandlers = require("./handlers");

const PORT = process.env.PORT;

const server = http.createServer((req, res) => {
  requestHandlers(req, res);
});

server.listen(PORT, () => console.log(`Server started on ${PORT}`));