const express = require("express");
const dotenv = require("dotenv");
const { Worker } = require("worker_threads");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

let worker = null;
app.get("/api/worker", (req, res) => {
  worker = new Worker("./worker.js");
  worker.postMessage("start");
  worker.on("message", (message) => {
    console.log("Received: ", message);
  });
  res.status(200).send('Worker created');
});

app.get("/api/worker/check", async (req, res) => {
  const result = await new Promise((resolve, reject) => {
    if (!worker) {
      resolve("Worker is not running");
    }

    worker.on("message", (message) => {
      resolve(message);
    });

    worker.on("error", (error) => {
      reject(error);
    });

    worker.postMessage("check");
  });

  res.status(200).send(result);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
