const kafka = require("kafka-node");
const Consumer = kafka.Consumer;
const fs = require("fs");
const sendToS3 = require("./sendToS3.js");

const client = new kafka.KafkaClient({ kafkaHost: "35.183.71.251:9092" });

const consumer = new Consumer(
  client,
  [
    { topic: "jsonlogs" } // payload
  ],
  {
    autoCommit: false, // options (which is like KafkaConfig file)
    fetchMinBytes: 1,
    fetchMaxBytes: 1024 * 100,
    encoding: "utf8",
    keyEncoding: "utf8"
  }
);

let size = 0;
let max = 50;
let fileNum = 1;

consumer.on("message", message => {
  // batch messages to a file
  // when reach a certain size (time?) sendToS3
  const jsonString = JSON.stringify(message);

  fs.appendFile(`../log_data_${fileCount}.json`, jsonString + "\n", err => {
    if (err) {
      console.log("Error writing file", err);
    } else {
      console.log("Success");
      size += 1;

      if (size >= max) {
        sendToS3(fileNum);
        size = 0;
        fileNum += 1;
      }
    }
  });
});
