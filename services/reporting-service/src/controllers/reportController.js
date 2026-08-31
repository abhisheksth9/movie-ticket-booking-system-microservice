const { DailyReport } = require('../../models');
const { GetObjectCommand } = require('@aws-sdk/client-s3');
const { rustfsClient } = require('../../config/rustfsClient');
const { Op } = require('sequelize');
const { generateDailyReport } = require('../services/reportGenerator');

const getReportByDate = async (req, res, next) => {
    try{
        const { date } = req.params;
        const { report } = await DailyReport.findOne({ where: { date }});

        if (!report) {
            return res.status(404).json({ message: `No report found for ${date}`});
        }
        res.status(200).json(report);
    } catch(err){
        next(err);
    }
}

const listReports = async (req, res, next ) => {
    try {
        const { from, to } = req.query;
        const where = from && to ? { date: { [Op.between]: [from, to] }} : {};

        const reports = await DailyReport.findAll({ where, order: [['date', 'DESC']] });
        res.status(200).json(reports);
    } catch (err) {
        next(err);
    }
};

const regenerateReport = async ( req, res, next ) => {
    try {
        const { date } = req.params;
        const report = await generateDailyReport(date);
        res.status(200).json(report);
    } catch (err) {
        next(err);
    }
};

const downloadReportPdf = async (req, res, next ) => {
    try{
        const { date } = req.params;
        const report = await DailyReport.findOne({ where: { date }});

        if (!report || !report.reportFileKey ) {
            return res.status(404).json({ message: 'No PFD export found for ${date}'});
        }

        const { Body } = await rustfsClient.send(new GetObjectCommand({
            Bucket: process.env.RUSTFS_BUCKET,
            Key: report.reportFileKey
        }));

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="report-${date}.pdf"`);
        Body.pipe(res);
    } catch (err) {
        next(err);
    }
};

module.exports = { getReportByDate, listReports, regenerateReport, downloadReportPdf };