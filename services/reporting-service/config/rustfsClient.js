const { S3Client } = require('@aws-sdk/client-s3');

const rustfsClient = new S3Client({
    endpoint: process.env.RUSTFS_ENDPOINT,
    region: process.env.RUSTFS_REGION,
    credentials: {
        accessKeyId: process.env.RUSTFS_ACCESS_KEY_ID,
        secretAccessKey: process.env.RUSTFS_SECRET_ACCESS_KEY
    },
    forcePathStyle: true
});

module.exports = rustfsClient;