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

  try {
    // Generate PDF buffer
    const pdfBuffer = await new Promise((resolve, reject) => {
      const doc = new PDFDocument();
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        resolve(Buffer.concat(buffers));
      });
      doc.on('error', reject);

      doc.fontSize(16).text('LifePro Feedback Summary', { align: 'center' });
      doc.moveDown();

      Object.entries(formData).forEach(([key, value]) => {
        const val = typeof value === 'object' ? JSON.stringify(value) : value;
        doc.fontSize(12).text(`${key}: ${val}`);
        doc.moveDown(0.5);
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
      html: `<p>Dear ${formData.name},</p><p>Thank you for your valuable feedback!</p><p>Regards,<br/>Lifepro Healthcare Team</p>`
    });

    // Send feedback PDF and Excel to admin
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
