import influxConsumer from "./consumers/influx_consumer.js";
import s3Consumer from "./consumers/s3_consumer.js";
import writeToInfluxDB from "./DB/write_to_influx.js";
import fs from "fs";
import sendToS3 from "./DB/send_to_s3.js";
import createQueue from "./bin/queue.js";
import config from "./config.js";

const path = require("path");
const CronJob = require("cron").CronJob;
const _ = require("lodash");
const queue = createQueue(parseInt(config.QUEUE_MAX_SIZE, 10));

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
  queue.add(syslogMsg);
});

s3Consumer.on("error", err => console.log("error", err));
process.on("SIGINT", () => {
  s3Consumer.close(true, () => process.exit());
});

// runs every day at midnight
new CronJob(
  "00 00 00 * *",
  () => {
    fs.readdir("./log_files", (err, files) => {
      if (err) {
        console.log("Error reading log files");
      } else {
        rotate(files);
      }
    });
  },
  function() {
    console.log("Finished log rotation");
  },
  true
);

// delete files that are 3 days old
const rotate = files => {
  const crntTime = new Date();
  const threeDaysFromNow =
    crntTime - (new Date().getTime() - 3 * 24 * 60 * 60 * 1000);

  _(files).forEach(file => {
    const fileDate = file.split("_")[1].replace(/-/g, "/");
    const fileTime = new Date(fileDate);

    if (crntTime - fileTime > threeDaysFromNow) {
      deleteFile(file);
    }
  });
};

const deleteFile = file => {
  console.log("Deleting file: " + file);
  fs.unlink(`./log_files/${file}`, err => {
    if (err) {
      console.log("Error encountered while deleting file");
    } else {
      console.log("Log file deleted: " + file);
    }
  });
};
