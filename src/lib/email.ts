import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

// Email Template:
export const sendVerificationEmail = async (to: string, url: string) => {
  await transporter.sendMail({
    from: `"Archflow" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Verify your email address - Archflow',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Verify your email</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #0b0f17; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0b0f17; padding: 40px 16px;">
            <tr>
              <td align="center">
                
                <!-- Main Card -->
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 520px; background-color: #111827; border: 1px solid #1f2937; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5);">
                  
                  <!-- Brand Header -->
                  <tr>
                    <td align="center" style="padding: 36px 32px 20px; border-bottom: 1px solid #1f2937;">
                      <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center">
                            <span style="font-size: 24px; font-weight: 800; letter-spacing: -0.5px; color: #ffffff; text-transform: uppercase;">
                              ARCH<span style="color: #3b82f6;">FLOW</span>
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td align="center" style="padding-top: 6px;">
                            <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #6b7280; font-weight: 600;">
                              AI Architecture Suite
                            </span>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Main Content -->
                  <tr>
                    <td style="padding: 36px 36px 28px;">
                      <h1 style="margin: 0 0 16px; font-size: 22px; font-weight: 700; color: #f9fafb; letter-spacing: -0.3px; text-align: center;">
                        Confirm your email address
                      </h1>
                      <p style="margin: 0 0 28px; font-size: 14px; line-height: 24px; color: #9ca3af; text-align: center;">
                        Welcome to Archflow! To complete your registration and activate your architecture workspace, please verify your email address below.
                      </p>

                      <!-- Action Button -->
                      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                          <td align="center" style="padding: 10px 0 28px;">
                            <a
                              href="${url}"
                              target="_blank"
                              style="display: inline-block; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: #ffffff; font-size: 14px; font-weight: 600; text-decoration: none; padding: 14px 36px; border-radius: 10px; box-shadow: 0 4px 14px rgba(37, 99, 235, 0.4); text-align: center; letter-spacing: 0.2px;"
                            >
                              Verify Email Address
                            </a>
                          </td>
                        </tr>
                      </table>

                      <!-- Expiration & Security Notice -->
                      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 14px 18px; margin-bottom: 24px;">
                        <tr>
                          <td style="font-size: 12px; line-height: 18px; color: #64748b; text-align: center;">
                            ⏱️ This verification link expires in 24 hours. If you didn't create an Archflow account, you can safely ignore this email.
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Card Footer -->
                  <tr>
                    <td align="center" style="background-color: #0d131f; padding: 20px 24px; border-top: 1px solid #1f2937;">
                      <p style="margin: 0; font-size: 11px; color: #4b5563; line-height: 16px;">
                        &copy; ${new Date().getFullYear()} Archflow. All rights reserved.<br />
                        Deterministic full-stack architectural synthesis.
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  });
};
