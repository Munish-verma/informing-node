'use strict';

const express = require("express");
const config = require('config');
const multer = require("multer");
const router = express.Router();
const storage = multer.memoryStorage();
const uploadDirect = multer({ storage });
const { FILE_UPLOAD_CONSTANTS, AUTH_CONSTANTS, SYSTEM_CONSTANTS } = require("../config/constant.js");
const { hetznerMediaUploadFunction } = require("../services/hetznerMediaUpload.js");
const { awsS3MediaUploadFunction } = require("../services/awsS3MediaUpload.js");
// const { gcsMediaUploadFunction } = require("../services/gcsMediaUpload.js");
const { success, successList, failure, internalError } = require("../helper/responseHelper.js");

async function uploadMedia({ key, data, contentType, folderName }) {

    console.log("ENVIRONMENT:", config.get('environment'));
    console.log("S3_BUCKET_REGION:", config.get('S3_BUCKET_REGION'));
    console.log("S3_BUCKET_NAME:", config.get('S3_BUCKET_NAME'));
    console.log("S3_ENDPOINT:", 'https://hel1.your-objectstorage.com');


    if (config.get('environment') === 'dev') {
        return hetznerMediaUploadFunction({ key, data, contentType, folderName });
        // } else if (config.get('environment') === 'uat') {
        //     return gcsMediaUploadFunction({ key, data, contentType, folderName });
    } else {
        return awsS3MediaUploadFunction({ key, data, contentType, folderName });
    }
}

router.post('/', uploadDirect.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return failure(res, req.apiId, FILE_UPLOAD_CONSTANTS.NO_FILE_UPLOADED, {});
        }
        const timestamp = Date.now();
        const fileName = `${timestamp}/${req.file.originalname.replace(/[^a-zA-Z0-9.]/g, '_')}`;

        const uploadResult = await uploadMedia({
            key: fileName,
            data: req.file.buffer,
            contentType: req.file.mimetype,
            folderName: 'aman-global-insurance',
        });

        const mediaUrl = uploadResult.url;
        let response = {}
        response.mediaUrl = mediaUrl
        return success(res, req.apiId, FILE_UPLOAD_CONSTANTS.FILE_UPLOAD_SUCCESS, response);
    } catch (error) {
        console.error("Exception: ", error.message);
        handleError(error, res, req);
    }
});

const handleError = (err, res, req) => {
    console.error(err);
    return internalError(res, req.apiId, err.message || SYSTEM_CONSTANTS.INTERNAL_SERVER_ERROR);
};

module.exports = router;