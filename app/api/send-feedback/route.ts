import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, feedback } = body;
    
    // Create a transporter with STARTTLS configuration for WEDOS
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
      requireTLS: true, // Require TLS
      tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false
      }
    });

    // Send the email
    await transporter.sendMail({
      from: process.env.SMTP_FROM_EMAIL,
      to: process.env.FEEDBACK_RECIPIENT_EMAIL,
      subject: `Zpětná vazba od ${firstName} ${lastName}`,
      text: `
        Jméno: ${firstName} ${lastName}
        Email: ${email}
        
        Zpětná vazba:
        ${feedback}
      `,
      html: `
        <p><strong>Jméno:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Zpětná vazba:</strong></p>
        <p>${feedback.replace(/\n/g, '<br>')}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { success: false, error: 'Nepodařilo se odeslat zpětnou vazbu. Zkuste to prosím později.' },
      { status: 500 }
    );
  }
}