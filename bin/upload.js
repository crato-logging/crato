import writeToFile from "../bin/write_to_file.js";
import fs from "fs";
import aws from "aws-sdk";
import config from "../config";

const s3 = new aws.S3({
  secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
  accessKeyId: config.AWS_ACCESS_KEY_ID
});

const upload = (fileName, content) => {
  writeToFile(fileName, content);

  fs.readFile(`./log_files/${fileName}`, (err, data) => {
    if (err) throw err;
    let params = {
      Bucket: config.AWS_S3_BUCKET_NAME,
      Key: fileName,
      Body: JSON.stringify(content)
    };

    s3.putObject(params, (err, data) => {
      if (err) throw err;
      console.log(
        `File ${fileName} uploaded successfully to ${config.AWS_S3_BUCKET_NAME} bucket`
      );
    });
  });
};

export default upload;
