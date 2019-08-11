import influxConsumer from "./consumers/influx_consumer.js";
import s3Consumer from "./consumers/s3_consumer.js";
import writeToInfluxDB from "./DB/write_to_influx.js";

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
  const jsonMsg = JSON.parse(syslogMsg);

  console.log(jsonMsg);
});

s3Consumer.on("error", err => console.log("error", err));
process.on("SIGINT", () => {
  s3Consumer.close(true, () => process.exit());
});
