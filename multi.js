const http = require("http");
const cluster = require("cluster");
const os = require("os");
require("dotenv").config();
const requestHandlers = require("./handlers");

const PORT = process.env.PORT;
const numCPUs = os.cpus().length - 1;
let curentWorkerNumber = 0;

function getWorkerId() {
  if (curentWorkerNumber >= numCPUs) {
    curentWorkerNumber = 0;
  }
  curentWorkerNumber += 1;
  return curentWorkerNumber;
}

function syncDB(data) {
  Object.values(cluster.workers).forEach((worker) => {
    worker.send({
      task: "sync",
      data,
    });
  });
}

if (cluster.isMaster) {
  let mainDB = {};
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork({ WORKER_PORT: Number(PORT) + i + 1 });
  }

  const loadBalancer = http.createServer((req, res) => {
    const id = getWorkerId();
    console.log(Number(PORT) + id, "PORT");

    const worker = cluster.workers[id];
    if (!worker) {
      res.statusCode = 404;
      res.end(`Worker ${id} not found`);
      return;
    }

    worker.on("message", (data) => {
      mainDB = data;
      syncDB(mainDB);
    });

    const proxyReq = http.request(
      {
        hostname: "localhost",
        port: Number(PORT) + id,
        path: req.url,
        method: req.method,
        headers: req.headers,
      },
      (proxyRes) => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res);
      }
    );

    req.pipe(proxyReq);
  });

  loadBalancer.listen(PORT, () => {
    console.log(`Load balancer listening on port ${PORT}`);
  });
} else {
  let workerDb = {};
  const workerPort = parseInt(process.env.WORKER_PORT);
  const server = http.createServer((req, res) => {
    requestHandlers(req, res, workerDb);
  });
  server.listen(workerPort, () =>
    console.log(`Worker ${cluster.worker.id} started on ${workerPort}`)
  );
  process.on("message", (msg) => {
    if (msg.task === "sync") {
      workerDb = msg.data;
    }
  });
}
