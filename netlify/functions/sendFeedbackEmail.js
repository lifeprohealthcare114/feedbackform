// netlify/functions/sendThankYou.js
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const formData = JSON.parse(event.body);
  const userEmail = formData.email;
  const userName = formData.name?.replace(/\s+/g, '_') || 'User';
  const dateStr = new Date().toISOString().split('T')[0];
  const adminEmail = 'admin@example.com';
  const pdfFileName = `${userName}_${dateStr}_feedback.pdf`;
  const excelFileName = `${userName}_${dateStr}_feedback.xlsx`;

  // Generate PDF
  const doc = new PDFDocument();
  let pdfBuffers = [];
  doc.on('data', pdfBuffers.push.bind(pdfBuffers));

  doc.fontSize(16).text('LifePro Feedback Summary', { align: 'center' });
  doc.moveDown();

  Object.entries(formData).forEach(([key, value]) => {
    const val = typeof value === 'object' ? JSON.stringify(value) : value;
    doc.fontSize(12).text(`${key}: ${val}`);
    doc.moveDown(0.5);
  });
  doc.end();

  // Generate Excel
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

  return new Promise((resolve) => {
    doc.on('end', async () => {
      const pdfBuffer = Buffer.concat(pdfBuffers);

      let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      try {
        // Send email to user from admin
        await transporter.sendMail({
          from: `LifePro Admin <${adminEmail}>`,
          to: userEmail,
          subject: 'Thank You for Your Feedback',
          html: `<p>Dear ${formData.name},</p><p>Thank you for your valuable feedback!</p><p>Regards,<br/>LifePro Team</p>`
        });

        // Send email to admin from user
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

        resolve({ statusCode: 200, body: 'Emails sent successfully.' });
      } catch (err) {
        console.error('Email error:', err);
        resolve({ statusCode: 500, body: 'Email sending failed.' });
      }
    });
  });
};
