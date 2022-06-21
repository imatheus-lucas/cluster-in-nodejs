import express from "express";
import cluster from "node:cluster";
import OS from "node:os";
import process from "node:process";

const numberCPUs = OS.cpus().length * 0.8;

if (cluster.isPrimary) {
  for (let i = 0; i < numberCPUs; i++) {
    cluster.fork();
  }

  cluster.on("online", function (worker) {
    console.log(`Worker ${worker.process.pid} is online`);
  });

  cluster.on("exit", (worker, code, signal) => {
    cluster.fork();
  });
} else {
  main();
}

function main() {
  const app = express();

  app.use(express.json());
  app.get("/", async (req, res) => {
    console.log(` sua request foi recebida pelo ${process.pid}`);
    res.send({
      message: `Hello World! ${process.pid}`,
    });
  });
  app.listen(3000, () => {
    console.log("Server is runnign on port 3000");
  });
}
