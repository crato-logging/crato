const Influx = require("influx");
import config from "../config.js";

const influx = new Influx.InfluxDB({
  database: "crato_logs",
  host: process.env.INFLUXDB_HOST,
  port: 8086,
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
