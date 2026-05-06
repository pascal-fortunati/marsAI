export const EMAIL_TEMPLATE_NAME = "marsAI Festival Template";

export function wrapCampaignEmailHtml(contentHtml: string) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body{margin:0;padding:0;background:#05030d;color:#e2e0ff;font-family:Arial,sans-serif}
    .wrap{padding:24px}
    .card{max-width:620px;margin:0 auto;border:1px solid rgba(125,113,251,.28);background:#05030d}
    .head{padding:18px 22px;border-bottom:1px solid rgba(125,113,251,.2);background:linear-gradient(135deg,rgba(125,113,251,.12),rgba(255,92,53,.08))}
    .brand{font-size:20px;font-weight:800;letter-spacing:.08em}
    .brand .mars{color:#e2e0ff}.brand .ai{color:#7d71fb}
    .hero{padding:22px;border-bottom:1px solid rgba(125,113,251,.15)}
    .body{padding:24px;color:rgba(226,224,255,.82);line-height:1.65}
    .body p{margin:0 0 14px}
    .body a{color:#9d6fff}
  </style>
</head>
<body>
  <div class="wrap">
    <div class="card">
      <div class="head">
        <div class="brand"><span class="mars">MARS</span><span class="ai">AI</span></div>
      </div>
      <div class="hero"></div>
      <div class="body">${contentHtml || ""}</div>
    </div>
  </div>
</body>
</html>`;
}
