function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function textToHtml(text) {
  return String(text || "")
    .split("\n")
    .map((line) => escapeHtml(line))
    .join("<br/>");
}

function buildLogoTag(logoUrl) {
  const safeLogoUrl = escapeHtml(String(logoUrl || "").trim());
  if (!safeLogoUrl) return "";
  return `<img src="${safeLogoUrl}" alt="marsAI" width="40" height="40" style="display:block;object-fit:contain;width:40px;height:40px;" />`;
}

export function buildFestivalEmailHtml({
  title,
  subtitle,
  eyebrow,
  bodyHtml,
  ctaLabel,
  ctaUrl,
  footerText,
  statusText,
  logoUrl,
}) {
  const safeTitle = escapeHtml(title || "marsAI 2026");
  const safeSubtitle = escapeHtml(
    subtitle || "Short films · 1–2 min · 100% AI · International",
  );
  const safeEyebrow = escapeHtml(eyebrow || "// FESTIVAL MARSEILLE · 2026");
  const safeFooter = escapeHtml(
    footerText || "Email envoyé automatiquement · Ne pas répondre",
  );
  const safeStatus = escapeHtml(statusText || "SYS:MARS_AI_2026 · STATUS:OPEN");
  const logoBlock = buildLogoTag(logoUrl);

  const ctaBlock =
    ctaLabel && ctaUrl
      ? `<div class="cta-block"><a href="${escapeHtml(ctaUrl)}" class="cta-btn">${escapeHtml(ctaLabel)}</a></div>`
      : "";

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body{margin:0;padding:0;background:#05030d;color:#e2e0ff;font-family:'Syne',Arial,sans-serif;-webkit-font-smoothing:antialiased}
    .wrap{padding:34px 16px;background:#05030d;background-image:radial-gradient(circle at 18% 22%,rgba(125,113,251,.12),transparent 38%),radial-gradient(circle at 82% 14%,rgba(255,92,53,.10),transparent 35%),linear-gradient(rgba(125,113,251,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(125,113,251,.05) 1px,transparent 1px);background-size:auto,auto,64px 64px,64px 64px}
    .card{max-width:620px;margin:0 auto;background:#05030d;background-image:radial-gradient(circle at 90% 8%,rgba(125,113,251,.12),transparent 38%),radial-gradient(circle at 8% 86%,rgba(255,92,53,.08),transparent 42%);border:1px solid rgba(125,113,251,.2);box-shadow:0 0 0 1px rgba(255,255,255,.02) inset,0 10px 35px rgba(0,0,0,.35)}
    .scan{height:2px;background:linear-gradient(90deg,transparent,#7d71fb 25%,#ff5c35 75%,transparent);opacity:.72}
    .head{padding:1px;background:linear-gradient(90deg,rgba(125,113,251,.78),rgba(255,92,53,.78))}
    .head-band{padding:14px 18px;background:#05030d;border-bottom:1px solid rgba(125,113,251,.2)}
    .head-table{width:100%;border-collapse:collapse}
    .brand-cell{vertical-align:middle}
    .status-cell{vertical-align:middle;text-align:right;padding-left:18px}
    .logo-table{border-collapse:collapse}
    .logo-table td{vertical-align:middle}
    .logo-gap{width:10px}
    .brand{font-size:19px;line-height:1;font-weight:800;letter-spacing:.08em}
    .brand .mars{color:#e2e0ff}
    .brand .ai{color:#ff5c35}
    .status{font-family:'Space Mono',monospace;font-size:9px;color:rgba(226,224,255,.45);letter-spacing:.14em;text-align:right;white-space:nowrap}
    .hero{padding:26px 20px 22px;border-bottom:1px solid rgba(125,113,251,.14);background:radial-gradient(circle at top right,rgba(125,113,251,.2),transparent 46%),radial-gradient(circle at bottom left,rgba(255,92,53,.14),transparent 52%),linear-gradient(135deg,rgba(255,255,255,.02),rgba(5,3,13,.7))}
    .eyebrow{font-family:'Space Mono',monospace;font-size:9px;color:#7d71fb;letter-spacing:.2em}
    .title{font-size:30px;line-height:1.1;font-weight:800;color:#fff;margin-top:10px;letter-spacing:-.01em}
    .subtitle{font-family:'Space Mono',monospace;font-size:11px;color:rgba(226,224,255,.52);line-height:1.65;margin-top:12px}
    .body{padding:26px 20px;color:rgba(226,224,255,.82);line-height:1.72;border-bottom:1px solid rgba(125,113,251,.1)}
    .body p{margin:0 0 14px}
    .body a{color:#a78bfa}
    .cta-block{text-align:center;margin:20px 0 8px}
    .cta-btn{display:inline-block;background:linear-gradient(135deg,#7d71fb,#9d6fff);color:#fff!important;text-decoration:none;padding:13px 28px;font-family:'Syne',Arial,sans-serif;font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase}
    .foot{padding:16px 20px;font-family:'Space Mono',monospace;font-size:10px;color:rgba(226,224,255,.42);letter-spacing:.08em}
    @media only screen and (max-width: 620px){
      .wrap{padding:18px 8px}
      .head-band{padding:12px 12px}
      .head-table,.head-table tbody,.head-table tr,.head-table td{display:block;width:100%!important}
      .status-cell{padding-left:0;padding-top:8px;text-align:left}
      .status{text-align:left;white-space:normal}
      .hero{padding:20px 14px 18px}
      .title{font-size:24px}
      .subtitle{font-size:10px}
      .body{padding:20px 14px}
      .foot{padding:14px}
      .cta-btn{padding:11px 16px;letter-spacing:.08em}
    }
  </style>
</head>
<body data-marsai-email-template="1">
  <div class="wrap">
    <div class="card">
      <div class="scan"></div>
      <div class="head">
        <div style="padding:0;background:#05030d">
          <div class="head-band">
            <table role="presentation" class="head-table">
              <tr>
                <td class="brand-cell">
                  <table role="presentation" class="logo-table">
                    <tr>
                      <td>${logoBlock}</td>
                      <td class="logo-gap"></td>
                      <td>
                        <div class="brand"><span class="mars">MARS</span><span class="ai">AI</span></div>
                      </td>
                    </tr>
                  </table>
                </td>
                <td class="status-cell">
                  <div class="status">${safeStatus}</div>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      <div class="hero">
        <div class="eyebrow">${safeEyebrow}</div>
        <div class="title">${safeTitle}</div>
        <div class="subtitle">${safeSubtitle}</div>
      </div>
      <div class="body">${bodyHtml || ""}${ctaBlock}</div>
      <div class="foot">${safeFooter}</div>
      <div class="scan"></div>
    </div>
  </div>
</body>
</html>`;
}

export function ensureFestivalEmailHtml({
  html,
  text,
  title,
  subtitle,
  logoUrl,
}) {
  const current = String(html || "").trim();
  if (current.includes('data-marsai-email-template="1"')) {
    const logoTag = buildLogoTag(logoUrl);
    if (current.includes('<div class="logo-wrap">')) {
      if (!logoTag) return current;
      return current.replace(
        /(<div class="logo-wrap">\s*)(<img\b[^>]*>\s*)?/i,
        `$1${logoTag}`,
      );
    }
    if (current.includes('class="logo-table"')) {
      return current.replace(
        /(<table role="presentation" class="logo-table">[\s\S]*?<tr>\s*<td>)[\s\S]*?(<\/td>\s*<td class="logo-gap">)/i,
        `$1${logoTag}$2`,
      );
    }
    return current;
  }
  const bodyHtml = current || `<p>${textToHtml(text || "")}</p>`;
  return buildFestivalEmailHtml({ title, subtitle, bodyHtml, logoUrl });
}
