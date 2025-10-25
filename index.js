import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Email sending route
app.post('/send-email', async (req, res) => {
  const { from, to, subject, content } = req.body;

  if (!from || !to || !subject || !content) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Setup transporter (SMTP)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, // e.g., smtp.gmail.com
      port: process.env.SMTP_PORT || 587,
      secure: false, // true for 465
      auth: {
        user: process.env.SMTP_USER, // your email
        pass: process.env.SMTP_PASS, // your email app password
      },
    });

    const mailOptions = {
      from,
      to,
      subject,
      text: content,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (err) {
    console.error('Email send error:', err);
    res.status(500).json({ message: 'Failed to send email', error: err });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
