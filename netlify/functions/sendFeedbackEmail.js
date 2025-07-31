const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

// Format keys into nice readable field names
function formatKey(key) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .replace(/_/g, ' ');
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const formData = JSON.parse(event.body);
  const userEmail = formData.email;
  const userName = formData.name?.replace(/\s+/g, '_') || 'User';
  const dateStr = new Date().toISOString().split('T')[0];
  const adminEmail = 'lifeprohealthcare114@gmail.com';
  const pdfFileName = `${userName}_${dateStr}_feedback.pdf`;
  const excelFileName = `${userName}_${dateStr}_feedback.xlsx`;

  try {
    // === PDF Creation ===
    const pdfBuffer = await new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      // Header
      doc.rect(0, 0, doc.page.width, 70).fill('#f1c40f');
      doc.fillColor('#000').fontSize(20).text('LifePro Feedback Summary', 70, 25);

      // Logo
      const logoPath = path.resolve(__dirname, 'logo.png');
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, 20, 15, { width: 40 });
      }

      doc.moveDown(2);
      doc.fillColor('#000').fontSize(12);

      // Feedback table-style layout
      Object.entries(formData).forEach(([key, value]) => {
        const label = formatKey(key);
        const val = typeof value === 'object' ? JSON.stringify(value) : value;

        doc
          .fillColor('#333')
          .font('Helvetica-Bold')
          .text(`${label}: `, { continued: true })
          .font('Helvetica')
          .fillColor('#000')
          .text(`${val}`);

        doc.moveDown(0.5);
      });

      doc.end();
    });

    // === Excel Creation ===
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Feedback');

    sheet.columns = [
      { header: 'Field', key: 'field', width: 30 },
      { header: 'Value', key: 'value', width: 50 },
    ];

    Object.entries(formData).forEach(([key, value]) => {
      const label = formatKey(key);
      const val = typeof value === 'object' ? JSON.stringify(value) : value;
      sheet.addRow({ field: label, value: val });
    });

    // Style header row
    sheet.getRow(1).font = { bold: true };

    const excelBuffer = await workbook.xlsx.writeBuffer();

    // === Email Sending ===
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Send thank you email to user
    await transporter.sendMail({
      from: `LifePro Admin <${adminEmail}>`,
      to: userEmail,
      subject: 'Thank You for Your Feedback',
      html: `
        <p>Dear ${formData.name},</p>
        <p>Thank you for your valuable feedback! We're always working to improve your experience.</p>
        <p>Best regards,<br/>LifePro Healthcare Team</p>
      `
    });

    // Send feedback attachments to admin
    await transporter.sendMail({
      from: `${formData.name} <${userEmail}>`,
      to: adminEmail,
      subject: 'New Feedback Submission Received',
      html: `<p>A new feedback form has been submitted. Please find the attached PDF and Excel summary.</p>`,
      attachments: [
        {
          filename: pdfFileName,
          content: pdfBuffer
        },
        {
          filename: excelFileName,
          content: excelBuffer
        }
      ]
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Emails sent successfully.' })
    };

  } catch (err) {
    console.error('Error sending emails:', err);
    return {
      statusCode: 500,
      body: 'Email sending failed.'
    };
  }
};
