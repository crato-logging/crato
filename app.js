import influxConsumer from "./consumers/influx_consumer.js";
import s3Consumer from "./consumers/s3_consumer.js";
import writeToInfluxDB from "./DB/write_to_influx.js";
import fs from "fs";
import sendToS3 from "./DB/send_to_s3.js";
import queue from "./bin/queue.js";

const path = require("path");
const CronJob = require("cron").CronJob;
const _ = require("lodash");

influxConsumer.on("message", message => {
  const syslogMsg = message.value; // the rest is Kafka meta data
  const jsonMsg = JSON.parse(syslogMsg);

  writeToInfluxDB(jsonMsg);
});

influxConsumer.on("error", err => console.log("error", err));
process.on("SIGINT", () => {
  influxConsumer.close(true, () => process.exit());
});

s3Consumer.on("message", message => {
  const syslogMsg = message.value; // the rest is Kafka meta data
  const jsonStr = JSON.stringify(syslogMsg);

  addToQueue(jsonStr);
});

s3Consumer.on("error", err => console.log("error", err));
process.on("SIGINT", () => {
  s3Consumer.close(true, () => process.exit());
});

let size = 0;
let MAX = 50;
let fileNum = 1;

const writeToFile = jsonStr => {
  fs.appendFile(`./log_files/log_data_${fileNum}.json`, jsonStr + "\n", err => {
    if (err) {
      console.log("Error write to file", err);
    } else {
      console.log("SUCCESS: Message written to file");
      size += 1;
      if (size >= MAX) {
        sendToS3(fileNum);
        size = 0;
        fileNum += 1;
      }
    }
  });
};

// runs every day at midnight
new CronJob("00 00 00 * *", () => {
  fs.readdir("./log_files", (err, files) => {
    if (err) {
      console.log("Error reading log files");
    } else {
      rotate(files);
    }
  });
});

const rotate = files => {
  const crntTime = new Date();
  //const threeDaysFromNow = crntTime - (new Date().getTime() - 3 * 24 * 60 * 60 * 1000));

  _(files).forEach(file => {
    const fileDate = file.split(".")[2];
  });
};
