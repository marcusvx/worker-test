const { parentPort } = require("worker_threads");
let processed = 0;
if (parentPort) {
  parentPort.on("message", (data) => {
    switch (data) {
      case "start": {
        console.log("Starting worker");
        void start();
        break;
      }

      case "check":
        parentPort?.postMessage({ processed });
        break;

      default:
        break;
    }
  });

  parentPort?.postMessage("alive");
}
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const iterations = 25000;
function start() {
  return new Promise(async (resolve) => {
    while (processed < iterations) {
      await sleep(500);
      processed++;
    }
    resolve("done");
  });
}
