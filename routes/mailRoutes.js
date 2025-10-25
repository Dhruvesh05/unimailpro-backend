// backend/routes/mailRoutes.js
import express from "express";
import nodemailer from "nodemailer";
import { supabase } from "../utils/supabaseClient.js";

const router = express.Router();

router.post("/send-email", async (req, res) => {
  try {
    let { from, to, subject, content, pdfFileNames } = req.body;

    if (!from || !to || !subject || !content) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Build mail options. Note: attachments should be files available on server disk or URLs.
    const mailOptions = {
      from,
      to: Array.isArray(to) ? to.join(",") : to,
      subject,
      text: content,
      // attachments: [] // if you want to attach PDF files from server path, fill here
    };

    // send mail
    await transporter.sendMail(mailOptions);

    // insert into supabase (use service key)
    const { error: insertError } = await supabase.from("email_records").insert({
      from_user: from,
      to_user: Array.isArray(to) ? to.join(", ") : to,
      subject,
      content,
      pdf_filename: pdfFileNames ? pdfFileNames.join(",") : null,
      sent_date: new Date().toISOString().split("T")[0],
    });

    if (insertError) throw insertError;

    res.json({ success: true, message: "Email sent and recorded." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
