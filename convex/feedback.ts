'use node'

import { v } from 'convex/values'
import { action } from './_generated/server'

// Feedback form validator
const feedbackValidator = v.object({
  firstName: v.string(),
  lastName: v.string(),
  email: v.string(),
  message: v.string(),
})

// Type for feedback data
interface FeedbackData {
  firstName: string
  lastName: string
  email: string
  message: string
}

// Simple email validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate feedback input
function validateFeedback(data: FeedbackData): string | null {
  if (!data.firstName.trim()) {
    return 'Jméno je povinné'
  }
  if (!data.lastName.trim()) {
    return 'Příjmení je povinné'
  }
  if (!data.email.trim()) {
    return 'E-mail je povinný'
  }
  if (!isValidEmail(data.email)) {
    return 'Neplatný formát e-mailu'
  }
  if (!data.message.trim()) {
    return 'Zpráva je povinná'
  }
  if (data.message.length < 10) {
    return 'Zpráva musí mít alespoň 10 znaků'
  }
  if (data.message.length > 5000) {
    return 'Zpráva je příliš dlouhá (max 5000 znaků)'
  }
  return null
}

export const sendFeedback = action({
  args: feedbackValidator,
  returns: v.object({
    success: v.boolean(),
    error: v.optional(v.string()),
  }),
  handler: async (_ctx, args) => {
    // Validate input
    const validationError = validateFeedback(args)
    if (validationError) {
      return { success: false, error: validationError }
    }

    // Check if SMTP is configured
    const smtpHost = process.env.SMTP_HOST
    const smtpUser = process.env.SMTP_USER
    const smtpPassword = process.env.SMTP_PASSWORD
    const smtpFromEmail = process.env.SMTP_FROM_EMAIL
    const feedbackRecipient = process.env.FEEDBACK_RECIPIENT_EMAIL

    if (
      !smtpHost ||
      !smtpUser ||
      !smtpPassword ||
      !smtpFromEmail ||
      !feedbackRecipient
    ) {
      console.error(
        'SMTP not configured. Required env vars: SMTP_HOST, SMTP_USER, SMTP_PASSWORD, SMTP_FROM_EMAIL, FEEDBACK_RECIPIENT_EMAIL',
      )
      return {
        success: false,
        error:
          'E-mailová služba není nakonfigurována. Kontaktujte nás prosím přímo.',
      }
    }

    try {
      // Dynamic import of nodemailer (only runs in Node.js environment)
      const nodemailer = await import('nodemailer')

      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: 587,
        secure: false,
        auth: {
          user: smtpUser,
          pass: smtpPassword,
        },
        requireTLS: true,
        tls: {
          ciphers: 'SSLv3',
          rejectUnauthorized: false,
        },
      })

      const { firstName, lastName, email, message } = args

      await transporter.sendMail({
        from: smtpFromEmail,
        to: feedbackRecipient,
        replyTo: email,
        subject: `Zpětná vazba od ${firstName} ${lastName}`,
        text: `
Jméno: ${firstName} ${lastName}
Email: ${email}

Zpětná vazba:
${message}
        `.trim(),
        html: `
<div style="font-family: sans-serif; max-width: 600px;">
  <p><strong>Jméno:</strong> ${escapeHtml(firstName)} ${escapeHtml(lastName)}</p>
  <p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
  <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
  <p><strong>Zpětná vazba:</strong></p>
  <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
</div>
        `.trim(),
      })

      return { success: true }
    } catch (error) {
      console.error('Failed to send feedback email:', error)
      return {
        success: false,
        error: 'Nepodařilo se odeslat zpětnou vazbu. Zkuste to prosím později.',
      }
    }
  },
})

// Helper to escape HTML to prevent XSS
function escapeHtml(text: string): string {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }
  return text.replace(/[&<>"']/g, (char) => htmlEscapes[char] || char)
}
