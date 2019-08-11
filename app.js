import influxConsumer from "./consumers/influx_consumer.js";
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
