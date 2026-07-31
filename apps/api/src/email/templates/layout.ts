import { env } from "../../config/env.js";

const COLORS = {
  navy: "#0B1F3A",
  emerald: "#0F766E",
  gold: "#C9A227",
  cream: "#F7F3EA",
  text: "#1A2332",
  muted: "#5B6575",
};

export function emailLayout(input: {
  title: string;
  preheader: string;
  bodyHtml: string;
}): { html: string; textFooter: string } {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(input.title)}</title>
</head>
<body style="margin:0;padding:0;background:${COLORS.cream};color:${COLORS.text};font-family:Georgia,'Times New Roman',serif;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(input.preheader)}</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${COLORS.cream};padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:560px;background:#ffffff;border:1px solid #e5e0d4;">
          <tr>
            <td style="background:${COLORS.navy};padding:20px 24px;">
              <div style="font-size:20px;font-weight:700;letter-spacing:0.04em;color:#ffffff;">
                <span style="color:${COLORS.gold};">WP</span> WorkProof Global
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 24px;font-size:16px;line-height:1.55;color:${COLORS.text};">
              ${input.bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:16px 24px 24px;font-size:13px;line-height:1.5;color:${COLORS.muted};border-top:1px solid #ece7db;">
              Questions? Contact <a href="mailto:${escapeHtml(env.SUPPORT_EMAIL)}" style="color:${COLORS.emerald};">${escapeHtml(env.SUPPORT_EMAIL)}</a>.
              WorkProof never asks for your password by email.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return {
    html,
    textFooter: `\n\nSupport: ${env.SUPPORT_EMAIL}\nWorkProof never asks for your password by email.`,
  };
}

export function ctaButton(label: string, href: string): string {
  return `<p style="margin:28px 0;"><a href="${escapeAttr(href)}" style="display:inline-block;background:${COLORS.emerald};color:#ffffff;text-decoration:none;padding:12px 22px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:700;">${escapeHtml(label)}</a></p>`;
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function escapeAttr(value: string): string {
  return escapeHtml(value).replace(/'/g, "&#39;");
}

export { COLORS };
