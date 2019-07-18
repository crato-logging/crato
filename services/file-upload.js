const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const config = require("../config");

aws.config.update({
  secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
  accessKeyId: config.AWS_ACCESS_KEY_ID
});

const logsBucket = new aws.S3();

const upload = multer({
  storage: multerS3({
    s3: logsBucket,
    bucket: "node-to-s3-test",
    metadata: function(req, file, cb) {
      cb(null, { fieldName: "TESTING_METADATA" });
    },
    key: function(req, file, cb) {
      cb(null, Date.now().toString());
    }
  })
});

module.exports = upload;
