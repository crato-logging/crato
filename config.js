require("dotenv").config();

module.exports = {
  INFLUX_DB_USERNAME: process.env.INFLUX_DB_USERNAME,
  INFLUX_DB_PASSWORD: process.env.INFLUX_DB_PASSWORD,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,
  QUEUE_MAX_SIZE: process.env.QUEUE_MAX_SIZE
};
