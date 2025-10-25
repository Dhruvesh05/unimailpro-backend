import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

export const sendEmail = async ({ from, to, subject, content, pdfUrl }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS // Gmail App Password
      }
    })

    const mailOptions = {
      from,
      to,
      subject,
      text: content,
      attachments: pdfUrl ? [{ path: `./uploads/${pdfUrl}` }] : []
    }

    const info = await transporter.sendMail(mailOptions)
    return info
  } catch (err) {
    console.error('Error sending email:', err)
    throw err
  }
}
