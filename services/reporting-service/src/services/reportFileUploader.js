const { PutObjectCommand } = require('@aws-sdk/client-s3');
const rustfsClient = require('../../config/rustfsClient');

const uploadReportPdf = async (date, pdfBuffer ) => {
    const key = `report/${date}.pdf`;

    await rustfsClient.send(new PutObjectCommand({
        Bucket: process.env.RUSTFS_BUCKET,
        Key: key,
        Body: pdfBuffer,
        ContentType: 'application/pdf'
    }));

    return key;
};

module.exports = { uploadReportPdf };