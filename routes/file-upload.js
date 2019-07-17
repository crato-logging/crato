const express = require("express");
const router = express.Router();

const upload = require("../services/file-upload");
const singleUpload = upload.single("test-file");

// end point for uploading to s3 bucket
router.post("/upload", (req, res) => {
  singleUpload(req, res, err => {
    if (err) {
      return res.status(422).send({
        errors: [{ title: "Image Upload Error", detail: err.message }]
      });
    }

    return res.json({ fileUrl: req.file.location });
  });
});

module.exports = router;
