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
      cb(null, Date.now().toString()); // this is how filename will appear in S3 bucket
    }
  }),
  limits: { fileSize: 2000000 }, // this is in bytes. 2000000 bytes = 2 mb
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
});

const checkFileType = (file, cb) => {
  // allowed extensions
  const filetypes = /log|txt/;
  // check extensions
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // check mime
  const mimetype = filename.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Invalid log file");
  }
};

module.exports = upload;
