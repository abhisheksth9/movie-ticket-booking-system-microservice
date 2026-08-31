const PDFDocument = require('pdfkit');

const drawTable = (doc, startX, startY, rows) => {
    const col1width = 220;
    const col2width = 120;
    const rowHeight = 22;
    let y = startY;

    rows.forEach(([label, value], i) => {
        if (i % 2 === 0) {
            doc.rect(startX, y, col1width + col2width, rowHeight).fill('#f2f2f2');
            doc.fillColor('#000000');
        }

        doc.fontSize(11)
            .text(label, startX + 8, y + 6, { width: col1width - 16 })
            .text(String(value), startX + col1width + 8, y + 6, { width: col2width - 16, align: 'right' });

        y += rowHeight;
    });

    doc.rect(startX, startY, col1width + col2width, rows.length * rowHeight).stroke();

    return y;
}

const buildReportPdf = (report) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 50 });
        const chunks = [];

        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        doc.fontSize(18).text(`Daily System Report - ${report.date}`, { underline: true });
        doc.moveDown();

        let y = doc.y;

        doc.fontSize(14).text('Auth', 50, y);
        y = drawTable(doc, 50, y + 20, [
            ['New users', report.newUsers],
            ['Logins', report.logins],
            ['Deletions', report.deletions],
        ]);
        y += 25;

        doc.fontSize(14).text('Bookings', 50, y);
        y = drawTable(doc, 50, y + 20, [
            ['Created', report.bookingsCreated],
            ['Cancelled', report.bookingsCancelled]
        ]);
        y += 25;

        doc.fontSize(14).text('Payments', 50, y);
        y = drawTable(doc, 50, y + 20, [
            ['Payments processed', report.paymentsProcessed],
            ['Total revenue', report.totalRevenue],
            ['Refunds issued', report.refundsIssued],
            ['Total refunded', report.totalRefunded],
            ['Wallet top-ups', report.walletTopups],
            ['Total top-up amount', report.totalTopupAmount]
        ]);
        doc.end();
    });
};

module.exports = { buildReportPdf };