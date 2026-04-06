import nodemailer from "nodemailer";

function getTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT ?? "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

const FROM = `"Ellice Investment Group" <${process.env.SMTP_FROM ?? process.env.SMTP_USER ?? "noreply@elliceinvestmentgroup.com"}>`;

export async function sendNewStatementEmail(to: string, name: string, period: string) {
  const transport = getTransport();
  await transport.sendMail({
    from: FROM,
    to,
    subject: `Your ${period} Account Statement is Ready`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;background:#fff;border-top:6px solid #2D5A43">
        <div style="padding:40px 40px 20px">
          <img src="${process.env.NEXTAUTH_URL}/logo.svg" alt="Ellice Investment Group" style="height:48px;width:auto;margin-bottom:32px"/>
          <h1 style="font-size:22px;color:#1a1a1a;margin:0 0 8px">Your ${period} statement is ready</h1>
          <p style="font-size:15px;color:#555;margin:0 0 28px">Hi ${name},<br/><br/>Your quarterly account statement for <strong>${period}</strong> is now available in the investor portal.</p>
          <a href="${process.env.NEXTAUTH_URL}/dashboard/statements"
             style="display:inline-block;background:#2D5A43;color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;font-size:14px;font-weight:600">
            View Statement →
          </a>
          <p style="font-size:12px;color:#999;margin:32px 0 0">If you have questions, contact <a href="mailto:support@elliceinvestmentgroup.com" style="color:#2D5A43">support@elliceinvestmentgroup.com</a></p>
        </div>
        <div style="background:#f8f7f4;padding:16px 40px;font-size:11px;color:#aaa;border-top:1px solid #eee">
          © ${new Date().getFullYear()} Ellice Investment Group · All figures in USD · Past performance is not indicative of future results
        </div>
      </div>
    `,
  });
}

export async function sendNewDocumentEmail(to: string, name: string, title: string, description: string) {
  const transport = getTransport();
  await transport.sendMail({
    from: FROM,
    to,
    subject: `New Document Available: ${title}`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;background:#fff;border-top:6px solid #2D5A43">
        <div style="padding:40px 40px 20px">
          <img src="${process.env.NEXTAUTH_URL}/logo.svg" alt="Ellice Investment Group" style="height:48px;width:auto;margin-bottom:32px"/>
          <h1 style="font-size:22px;color:#1a1a1a;margin:0 0 8px">New document available</h1>
          <p style="font-size:15px;color:#555;margin:0 0 8px">Hi ${name},<br/><br/>A new document has been posted to your investor portal:</p>
          <div style="background:#f8f7f4;border-radius:8px;padding:16px 20px;margin:20px 0">
            <p style="font-size:15px;font-weight:600;color:#1a1a1a;margin:0 0 4px">${title}</p>
            ${description ? `<p style="font-size:13px;color:#666;margin:0">${description}</p>` : ""}
          </div>
          <a href="${process.env.NEXTAUTH_URL}/dashboard/documents"
             style="display:inline-block;background:#2D5A43;color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;font-size:14px;font-weight:600">
            View Document →
          </a>
          <p style="font-size:12px;color:#999;margin:32px 0 0">If you have questions, contact <a href="mailto:support@elliceinvestmentgroup.com" style="color:#2D5A43">support@elliceinvestmentgroup.com</a></p>
        </div>
        <div style="background:#f8f7f4;padding:16px 40px;font-size:11px;color:#aaa;border-top:1px solid #eee">
          © ${new Date().getFullYear()} Ellice Investment Group
        </div>
      </div>
    `,
  });
}
