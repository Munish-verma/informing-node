'use strict';

const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const config = require('config');

const hetznerS3Client = new S3Client({
    region: config.get('S3_BUCKET_REGION') || 'hel1',
    endpoint: 'https://hel1.your-objectstorage.com',
    credentials: {
        accessKeyId: config.get('S3_ACCESS_KEY') || '',
        secretAccessKey: config.get('S3_SECRET_KEY') || '',
    },
});
const HETZNER_BUCKET_NAME = config.get('S3_BUCKET_NAME') || 'informing';

async function hetznerMediaUploadFunction({ key, data, contentType, folderName }) {
    if (!key || !data) throw new Error('Key and data are required for upload');
    const finalKey = folderName ? `${folderName}/${key}` : key;
    const params = {
        Bucket: HETZNER_BUCKET_NAME,
        Key: finalKey,
        Body: data,
        ContentType: contentType,
    };
    await hetznerS3Client.send(new PutObjectCommand(params));
    const url = `https://${HETZNER_BUCKET_NAME}.hel1.your-objectstorage.com/${finalKey}`;
    return { statusCode: 200, message: "Media file uploaded successfully", url };
}

module.exports = { hetznerMediaUploadFunction };
