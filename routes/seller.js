const router = require('express').Router();
const Product = require('../models/product');

const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const s3 = new aws.S3({ accessKeyId: 'YourAccessKey', secretAccessKey: 'YourSecretKey' });

const upload = multer({
  storage:multerS3({
    s3: s3,
    bucket: 'amazoniumwebapplication',
    metadata: function(req, file, cb) {
      cb(null, { fieldName: file.fieldName });
    },
    key: function(req, file, cb) {
      cb(null, { fieldName: file.fieldName });
    },
  })
});
module.exports = router;