const Influx = require("influx");
import config from "../config.js";

const influx = new Influx.InfluxDB({
  database: "LOG_DATA3",
  host: "35.183.71.251",
  port: 8086,
  username: config.INFLUX_DB_USERNAME,
  password: config.INFLUX_DB_PASSWORD,
  schema: [
    {
      fields: {
        message: Influx.FieldType.STRING,
        time: Influx.FieldType.STRING,
        raw: Influx.FieldType.STRING
      },
      tags: ["host", "severity", "facility"]
    }
  ]
});

export default influx;
