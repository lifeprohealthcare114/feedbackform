// netlify/functions/sendThankYou.js

const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

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
    // Create PDF Buffer with Layout
    const pdfBuffer = await new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 40 });
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      // Header bar
      doc.rect(0, 0, doc.page.width, 60).fill('#f1c40f');

      // Logo
      const logoPath = path.resolve(__dirname, 'logo.png');
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, 20, 15, { width: 40 });
      }

      // Title
      doc
        .fillColor('#000')
        .fontSize(18)
        .text('LifePro Feedback Summary', 70, 25, { align: 'center', continued: false });

      doc.moveDown(2);

      // Form Fields in Boxed Layout
      Object.entries(formData).forEach(([key, value]) => {
        const val = typeof value === 'object' ? JSON.stringify(value) : value;

        doc
          .fillColor('#333')
          .fontSize(12)
          .rect(doc.x, doc.y, doc.page.width - 80, 30)
          .stroke()
          .fillColor('#000')
          .text(`${key}: ${val}`, { lineBreak: true, continued: false });

        doc.moveDown(1);
      });

      doc.end();
    });

    // Generate Excel buffer
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Feedback');
    sheet.columns = [
      { header: 'Field', key: 'field' },
      { header: 'Value', key: 'value' },
    ];
    Object.entries(formData).forEach(([key, value]) => {
      const val = typeof value === 'object' ? JSON.stringify(value) : value;
      sheet.addRow({ field: key, value: val });
    });
    const excelBuffer = await workbook.xlsx.writeBuffer();

    // Setup transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Send Thank You email to user
    await transporter.sendMail({
      from: `LifePro Admin <${adminEmail}>`,
      to: userEmail,
      subject: 'Thank You for Your Feedback',
      html: `<p>Dear ${formData.name},</p><p>Thank you for your valuable feedback!</p><p>Regards,<br/>LifePro Healthcare Team</p>`
    });

    // Send feedback attachments to admin
    await transporter.sendMail({
      from: `${formData.name} <${userEmail}>`,
      to: adminEmail,
      subject: 'New Feedback Submission Received',
      text: 'A new feedback form was submitted by a user.',
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
