const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Send email
 */
const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || 'Mehbere Edomias <noreply@mehbere-edomias.org>',
      to,
      subject,
      html,
    });
    console.log(`✅ Email sent to ${to}`);
    return info;
  } catch (error) {
    console.error('❌ Email error:', error);
    throw error;
  }
};

/**
 * Send welcome email to new member
 */
const sendWelcomeEmail = async (email, fullName, phoneNumber, tempPassword) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #1a365d; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">🙏 Welcome to Mehbere Edomias</h1>
      </div>
      <div style="padding: 20px; background: #f7fafc;">
        <p>Dear <strong>${fullName}</strong>,</p>
        <p>Welcome to the Mehbere Edomias Spiritual Association! Your account has been created.</p>
        
        <div style="background: white; padding: 15px; border-radius: 5px; margin: 20px 0; border: 1px solid #e2e8f0;">
          <h3 style="margin-top: 0;">Your Login Credentials:</h3>
          <p><strong>Phone:</strong> ${phoneNumber}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Temporary Password:</strong> <code style="background: #e2e8f0; padding: 2px 6px; border-radius: 3px;">${tempPassword}</code></p>
          <p style="color: #e53e3e; font-size: 14px;">⚠️ Please change your password after your first login.</p>
        </div>
        
        <p style="text-align: center;">
          <a href="${process.env.FRONTEND_URL}/login" style="background: #1a365d; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Login Now</a>
        </p>
        
        <p>May God bless you abundantly!</p>
        <p>In Christ,<br><strong>Mehbere Edomias Team</strong></p>
      </div>
      <div style="text-align: center; padding: 20px; color: #718096; font-size: 14px;">
        <p>© 2024 Mehbere Edomias Spiritual Association</p>
        <p>This is an automated message. Please do not reply.</p>
      </div>
    </div>
  `;
  return sendEmail(email, 'Welcome to Mehbere Edomias 🙏', html);
};

/**
 * Send email verification link
 */
const sendVerificationEmail = async (email, fullName, verificationToken) => {
  const verifyUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #1a365d; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">📧 Verify Your Email</h1>
      </div>
      <div style="padding: 20px; background: #f7fafc;">
        <p>Dear <strong>${fullName}</strong>,</p>
        <p>Thank you for registering with Mehbere Edomias Spiritual Association.</p>
        <p>Please click the button below to verify your email address:</p>
        
        <p style="text-align: center;">
          <a href="${verifyUrl}" style="background: #1a365d; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email</a>
        </p>
        
        <p style="color: #718096; font-size: 14px;">⏰ This link will expire in 24 hours.</p>
        <p style="color: #718096; font-size: 14px;">If you didn't register, please ignore this email.</p>
        
        <p style="margin-top: 20px;">In Christ,<br><strong>Mehbere Edomias Team</strong></p>
      </div>
      <div style="text-align: center; padding: 20px; color: #718096; font-size: 14px;">
        <p>© 2024 Mehbere Edomias Spiritual Association</p>
      </div>
    </div>
  `;
  return sendEmail(email, 'Verify Your Email - Mehbere Edomias', html);
};

/**
 * Send password reset email
 */
const sendPasswordResetEmail = async (email, fullName, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #1a365d; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">🔑 Reset Your Password</h1>
      </div>
      <div style="padding: 20px; background: #f7fafc;">
        <p>Dear <strong>${fullName}</strong>,</p>
        <p>We received a request to reset your password.</p>
        <p>Click the button below to set a new password:</p>
        
        <p style="text-align: center;">
          <a href="${resetUrl}" style="background: #1a365d; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
        </p>
        
        <p style="color: #718096; font-size: 14px;">⏰ This link will expire in 1 hour.</p>
        <p style="color: #718096; font-size: 14px;">If you didn't request this, please ignore this email.</p>
        
        <p style="margin-top: 20px;">In Christ,<br><strong>Mehbere Edomias Team</strong></p>
      </div>
      <div style="text-align: center; padding: 20px; color: #718096; font-size: 14px;">
        <p>© 2024 Mehbere Edomias Spiritual Association</p>
      </div>
    </div>
  `;
  return sendEmail(email, 'Reset Your Password - Mehbere Edomias', html);
};

/**
 * Send donation receipt email
 */
const sendDonationReceipt = async (email, fullName, donation) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #1a365d; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">💰 Donation Receipt</h1>
      </div>
      <div style="padding: 20px; background: #f7fafc;">
        <p>Dear <strong>${fullName}</strong>,</p>
        <p>Thank you for your generous donation!</p>
        
        <div style="background: white; padding: 15px; border-radius: 5px; margin: 20px 0; border: 1px solid #e2e8f0;">
          <h3 style="margin-top: 0;">Donation Details:</h3>
          <p><strong>Receipt Number:</strong> ${donation.receiptNumber}</p>
          <p><strong>Type:</strong> ${donation.donationType}</p>
          <p><strong>Amount:</strong> ${donation.amount} ETB</p>
          <p><strong>Date:</strong> ${new Date(donation.donationDate).toLocaleDateString()}</p>
          <p><strong>Status:</strong> ${donation.status}</p>
        </div>
        
        <p>May God bless you abundantly for your generosity!</p>
        <p>In Christ,<br><strong>Mehbere Edomias Team</strong></p>
      </div>
      <div style="text-align: center; padding: 20px; color: #718096; font-size: 14px;">
        <p>© 2024 Mehbere Edomias Spiritual Association</p>
      </div>
    </div>
  `;
  return sendEmail(email, `Donation Receipt #${donation.receiptNumber}`, html);
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendDonationReceipt,
};