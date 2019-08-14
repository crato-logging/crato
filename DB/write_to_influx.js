import influx from "./influx.js";

influx
  .getDatabaseNames()
  .then(names => {
    if (!names.includes("crato_logs")) {
      return influx.createDatabase("crato_logs");
    }
  })
  .catch(error => console.log({ error }));

const writeToInfluxDB = jsonMsg => {
  const time = jsonMsg.timestamp;
  const severity = jsonMsg.severity;
  const rawmsg = jsonMsg["raw-message"];
  const facility = jsonMsg.facility;
  const host = jsonMsg.host;
  let measurement_name = jsonMsg["syslog-tag"].slice(0, -1);

  if (severity === "err") {
    measurement_name = "error";
  }

  if (facility === "auth" || facility === "authpriv") {
    measurement_name = "authentication";
  }

  influx
    .writePoints(
      [
        {
          measurement: measurement_name,
          tags: {
            host: host,
            severity: severity,
            facility: facility
          },
          fields: {
            message: rawmsg,
            time: time,
            raw: JSON.stringify(jsonMsg) //a complete message for later analysis if needed
          }
        }
      ],
      {
        database: "crato_logs"
      }
    )
    .then(() => {
      console.log("success");
    })
    .catch(error => {
      console.error("Error saving data to db.");
    });
};

export default writeToInfluxDB;
