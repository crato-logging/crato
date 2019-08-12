import upload from "../bin/upload.js";
import config from "../config";

const sendToS3 = logsArr => {
  const d = new Date();
  const date = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
  const fileName = `${Date.now()}_${date}_log_data.json`;

  const content = logsArr.map(event => {
    return event + "\n";
  });

  upload(fileName, content);
};

export default sendToS3;
