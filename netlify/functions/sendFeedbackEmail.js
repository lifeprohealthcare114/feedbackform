const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

// Format keys into readable field names
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
    // === PDF Generation ===
    const pdfBuffer = await new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      // Header background
      doc.rect(0, 0, doc.page.width, 60).fill('#f1c40f');
      doc.fillColor('#000').fontSize(20).font('Helvetica-Bold').text('Lifepro Healthcare Feedback Summary', 70, 20);

      // Logo (optional)
      const logoPath = path.resolve(__dirname, 'logo.png');
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, 20, 15, { width: 40 });
      }

      doc.moveDown(3);
      doc.fontSize(12).fillColor('#000');

      const section = (title) => {
        doc.moveDown(1).fontSize(13).fillColor('#333').font('Helvetica-Bold').text(title, { underline: true }).moveDown(0.5);
      };

      const printField = (label, value) => {
        const val = typeof value === 'object' ? JSON.stringify(value, null, 2) : (value || 'N/A');
        doc
          .font('Helvetica-Bold').fillColor('#111').text(`${label}: `, { continued: true })
          .font('Helvetica').fillColor('#000').text(val)
          .moveDown(0.3);
      };

      // Sections
      section('Contact Information');
      ['name', 'email', 'phone', 'companyName', 'customerStatus', 'customerDuration', 'howHeard']
        .forEach(k => printField(formatKey(k), formData[k]));

      section('Product Feedback');
      ['productInterest', 'productSatisfaction', 'favoriteFeatures', 'productRecommendation', 'npsScore', 'companyOverallSatisfaction']
        .forEach(k => printField(formatKey(k), formData[k]));

      section('Brand Perception');
      const brand = formData.brandStatements || {};
      ['innovative', 'reliable', 'customerCentric', 'trustworthy']
        .forEach(k => printField(formatKey(k), brand[k] ? 'Yes' : 'No'));

      section('Customer Service');
      ['customerServiceUsed', 'customerServiceRating']
        .forEach(k => printField(formatKey(k), formData[k]));

      section('Website Feedback');
      ['websiteEaseOfUse', 'websiteImprovements']
        .forEach(k => printField(formatKey(k), formData[k]));

      section('Final Comments');
      ['generalComments', 'contactForFollowUp', 'followUpEmail']
        .forEach(k => printField(formatKey(k), formData[k]));

      doc.end();
    });

    // === Excel Generation ===
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

    // Email to user
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

    // Email to admin with attachments
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
