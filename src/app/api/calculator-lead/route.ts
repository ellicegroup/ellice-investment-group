import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

function getTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT ?? "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
}

export async function POST(req: NextRequest) {
  const { name, email, phone, range, fund, message, principal, monthlyPMT, years } = await req.json();

  if (!name || !email) {
    return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
  }

  const SMTP_USER = process.env.SMTP_USER;
  if (!SMTP_USER) {
    // SMTP not configured — log and return success anyway so UX works
    console.info("[Lead] SMTP not configured. Lead:", { name, email });
    return NextResponse.json({ ok: true });
  }

  const transport = getTransport();
  const FROM = `"Ellice Investment Group" <${process.env.SMTP_FROM ?? SMTP_USER}>`;
  const ADMIN = process.env.ADMIN_EMAIL ?? "etekafa@elliceinvestmentgroup.com";

  // Email to Easter Tekafa
  await transport.sendMail({
    from: FROM,
    to: ADMIN,
    subject: `🔔 New Discovery Call Request — ${name}`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:580px;margin:0 auto;background:#fff;border-top:6px solid #534AB7">
        <div style="padding:36px 40px">
          <h1 style="font-size:20px;color:#13175c;margin:0 0 6px">New Discovery Call Request</h1>
          <p style="font-size:13px;color:#999;margin:0 0 28px">Submitted via the Investment Calculator on elliceinvestmentgroup.com</p>

          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr><td style="padding:10px 0;color:#888;width:140px;vertical-align:top">Name</td><td style="padding:10px 0;color:#1a1a1a;font-weight:600">${name}</td></tr>
            <tr style="border-top:1px solid #f0f0f0"><td style="padding:10px 0;color:#888;vertical-align:top">Email</td><td style="padding:10px 0;color:#1a1a1a"><a href="mailto:${email}" style="color:#534AB7">${email}</a></td></tr>
            ${phone ? `<tr style="border-top:1px solid #f0f0f0"><td style="padding:10px 0;color:#888;vertical-align:top">Phone</td><td style="padding:10px 0;color:#1a1a1a">${phone}</td></tr>` : ""}
            ${range ? `<tr style="border-top:1px solid #f0f0f0"><td style="padding:10px 0;color:#888;vertical-align:top">Investment Range</td><td style="padding:10px 0;color:#1a1a1a">${range}</td></tr>` : ""}
            ${fund ? `<tr style="border-top:1px solid #f0f0f0"><td style="padding:10px 0;color:#888;vertical-align:top">Fund Interest</td><td style="padding:10px 0;color:#1a1a1a">${fund}</td></tr>` : ""}
            ${message ? `<tr style="border-top:1px solid #f0f0f0"><td style="padding:10px 0;color:#888;vertical-align:top">Message</td><td style="padding:10px 0;color:#1a1a1a">${message}</td></tr>` : ""}
          </table>

          <div style="background:#f0f7f3;border-radius:10px;padding:18px 20px;margin:24px 0;border:1px solid #c8e0d4">
            <p style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#534AB7;margin:0 0 8px">Their Calculator Scenario</p>
            <p style="font-size:14px;color:#1a1a1a;margin:0">
              Initial: <strong>${fmt(principal)}</strong> · Monthly: <strong>${fmt(monthlyPMT)}/mo</strong> · Period: <strong>${years} years</strong>
            </p>
          </div>

          <a href="mailto:${email}" style="display:inline-block;background:#534AB7;color:#fff;text-decoration:none;padding:11px 26px;border-radius:8px;font-size:14px;font-weight:600">
            Reply to ${name} →
          </a>
        </div>
        <div style="background:#f8f7f4;padding:14px 40px;font-size:11px;color:#aaa;border-top:1px solid #eee">
          © ${new Date().getFullYear()} Ellice Investment Group
        </div>
      </div>
    `,
  });

  // Confirmation email to the lead
  await transport.sendMail({
    from: FROM,
    to: email,
    subject: "Thanks for reaching out — Ellice Investment Group",
    html: `
      <div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;background:#fff;border-top:6px solid #534AB7">
        <div style="padding:40px 40px 24px">
          <h1 style="font-size:22px;color:#13175c;margin:0 0 16px">Hi ${name}, we received your request!</h1>
          <p style="font-size:15px;color:#555;line-height:1.75;margin:0 0 20px">
            Thank you for using our investment calculator and expressing interest in Ellice Investment Group.
            Our Managing Director <strong>Easter Tekafa</strong> will be in touch within 1–2 business days to schedule your free discovery call.
          </p>
          <div style="background:#f0f7f3;border-radius:10px;padding:18px 20px;margin:0 0 24px;border:1px solid #c8e0d4">
            <p style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#534AB7;margin:0 0 8px">Your Projection Summary</p>
            <p style="font-size:14px;color:#1a1a1a;margin:0">
              Starting with <strong>${fmt(principal)}</strong> over <strong>${years} years</strong>
              ${monthlyPMT > 0 ? ` with ${fmt(monthlyPMT)}/month contributions` : ""}.
            </p>
          </div>
          <p style="font-size:14px;color:#555;line-height:1.75;margin:0 0 28px">
            In the meantime, feel free to explore our <a href="${process.env.NEXTAUTH_URL ?? "https://www.elliceinvestmentgroup.com"}/learn" style="color:#534AB7">education resources</a>
            or reach out directly at <a href="mailto:etekafa@elliceinvestmentgroup.com" style="color:#534AB7">etekafa@elliceinvestmentgroup.com</a>.
          </p>
          <p style="font-size:14px;color:#555;margin:0">Warm regards,<br/><strong>Easter Tekafa</strong><br/>Managing Director, Ellice Investment Group</p>
        </div>
        <div style="background:#f8f7f4;padding:16px 40px;font-size:11px;color:#aaa;border-top:1px solid #eee">
          © ${new Date().getFullYear()} Ellice Investment Group · This is not financial advice.
        </div>
      </div>
    `,
  });

  return NextResponse.json({ ok: true });
}
