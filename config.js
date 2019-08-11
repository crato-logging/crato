require("dotenv").config();

module.exports = {
  INFLUX_DB_USERNAME: process.env.INFLUX_DB_USERNAME,
  INFLUX_DB_PASSWORD: process.env.INFLUX_DB_PASSWORD
};
