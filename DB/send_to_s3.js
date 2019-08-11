import fs from "fs";
import aws from "aws-sdk";

import config from "../config";

aws.config.update({
  secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
  accessKeyId: config.AWS_ACCESS_KEY_ID
});

const logsBucket = new aws.S3({
  params: { Bucket: "node-to-s3-test", timeout: 6000000 }
});

// const getOptions = fileNum => {
//   return {
//     method: "POST",
//     url: "http://localhost:3000/api/upload",
//     headers: {
//       "cache-control": "no-cache",
//       "Content-Type": "application/x-www-form-urlencoded",
//       "content-type":
//         "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW"
//     },
//     formData: {
//       "test-file": {
//         value:
//           fs.createReadStream(`../log_files_to_send/log_file_${fileNum}`),
//         options: {
//           filename: "/Users/solosphere/Documents/Brace Prescription.jpg",
//           contentType: null
//         }
//       }
//     }
//   };
// };

// const sendToS3 = fileNum => {
//   const options = getOptions(fileNum);
//   request(options, (err, res, body) => {
//     if (err) throw new Error(error);
//     console.log(body);
//   });
// };
//
// const sendToS3 = json => {
//   if (process.env["errorHandling"]) {
//     fetch(url, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json; charset=utf-8"
//       },
//       mode: "cors",
//       body: json
//     })
//       .then(response => response.json())
//       .then(json => console.log(json))
//       .catch(error => console.log(error));
//   } else {
//     navigator.sendBeacon(url, json);
//   }
// };

const sendToS3 = fileNum => {
  //fs.readFile(`../log_files_to_send/log_file_${fileNum}`, (err, data) => {
  //  let params = {
  //    ACL: "public-read",
  //    Key: "logz",
  //    Body: data,
  //    ContentType: "binary"
  //  };
  //  logsBucket.putObject(params, (err, data) => {
  //    if (err) console.log(err);
  //
  //    callback(null, data);
  //  });
  //});

  console.log("HELLO FROM S3 method");
};

export default sendToS3;
