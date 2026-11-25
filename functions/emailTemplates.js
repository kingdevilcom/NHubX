const logo = 'https://www.nhubx.com/nhubx-logo.png';
const portal = 'https://www.nhubx.com/orders';
const templates = {
  quote: { category: 'Your quote', heading: 'Your quote is ready', action: 'Review quote', footer: 'Sign in with the email address on your quote.' },
  update: { category: 'Order progress', heading: 'Your order has an update', action: 'Track order', footer: 'Your order timeline has the latest status and next steps.' },
  payment: { category: 'Payment receipt', heading: 'Payment confirmed', action: 'View payment and receipt', footer: 'Your receipt is available in the order portal.' },
  renewal: { category: 'Annual renewal', heading: 'Your renewal is coming up', action: 'Review renewal', footer: 'Development and annual services are billed separately.' },
  message: { category: 'Message from NHubX', action: 'Open my orders', footer: 'This message is about your NHubX order.' },
  enquiry: { category: 'Private admin notice', heading: 'New enquiries are waiting', action: 'Open admin inbox', footer: 'Sign in to Admin to review and reply.' },
  correspondence: { category: 'Message from NHubX', action: 'Visit NHubX', footer: 'NHubX · Matara, Sri Lanka', destination: 'https://www.nhubx.com/' },
};

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}

export function orderTemplateType(mail) {
  if (mail.template && Object.hasOwn(templates, mail.template)) return mail.template;
  if (mail.subject === 'Your NHubX quote is ready') return 'quote';
  if (mail.subject === 'NHubX renewal reminder') return 'renewal';
  if (mail.subject === 'NHubX order update') return /payment confirmed|renewal confirmed/i.test(mail.message) ? 'payment' : 'update';
  return 'message';
}

export function renderEmail({ type, subject, message, details = [] }) {
  const template = Object.hasOwn(templates, type) ? templates[type] : templates.message;
  const isAdmin = type === 'enquiry';
  const destination = template.destination ?? (isAdmin ? 'https://www.nhubx.com/admin' : portal);
  const heading = template.heading ?? subject;
  const preview = message.replace(/\s+/g, ' ').slice(0, 120);
  const rows = details.map(([label, value]) =>
    `<tr><td style="padding:10px 12px;border-bottom:1px solid #513229;color:#e5cfc6">${escapeHtml(label)}</td><td align="right" style="padding:10px 12px;border-bottom:1px solid #513229;color:#fff8f3;font-weight:bold;word-break:break-word">${escapeHtml(value)}</td></tr>`,
  ).join('');

  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(subject)}</title></head>
<body style="margin:0;background:#130d0f;color:#fff8f3;font-family:Arial,sans-serif">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${escapeHtml(preview)}</div>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#130d0f"><tr><td align="center" style="padding:24px 14px">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#211617;border:1px solid #513229;border-radius:18px">
<tr><td style="padding:22px 24px;border-bottom:1px solid #513229">
<table role="presentation" cellspacing="0" cellpadding="0"><tr><td><img src="${logo}" width="42" height="42" alt="" style="display:block;border-radius:9px"></td><td style="padding-left:12px;font-size:22px;font-weight:bold;color:#fff8f3">NHubX</td></tr></table>
</td></tr>
<tr><td style="padding:26px 24px 8px">
<p style="margin:0 0 8px;color:#ffad83;font-size:13px;font-weight:bold">${escapeHtml(template.category)}</p>
<h1 style="margin:0 0 14px;color:#fff8f3;font-size:30px;line-height:1.2">${escapeHtml(heading)}</h1>
<p style="margin:0 0 18px;color:#eddbd4;font-size:16px;line-height:1.6;word-break:break-word">${escapeHtml(message).replace(/\r?\n/g, '<br>')}</p>
${rows ? `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 18px;background:#2c1c1c;border-radius:8px;font-size:14px">${rows}</table>` : ''}
<table role="presentation" cellspacing="0" cellpadding="0"><tr><td style="background:#ff975f;border-radius:9px"><a href="${destination}" style="display:inline-block;padding:13px 18px;color:#221008;text-decoration:none;font-size:15px;font-weight:bold">${escapeHtml(template.action)}</a></td></tr></table>
</td></tr>
<tr><td style="padding:14px 24px 24px;font-size:13px;line-height:1.6;color:#d3b7ac">${escapeHtml(template.footer)}<br><a href="https://www.nhubx.com/" style="color:#ffad83">nhubx.com</a></td></tr>
</table></td></tr></table></body></html>`;

  const text = [
    'NHubX | ' + template.category,
    heading,
    message,
    details.map(([label, value]) => label + ': ' + value).join('\n'),
    template.action + ': ' + destination,
    template.footer,
  ].filter(Boolean).join('\n\n');
  return { html, text };
}
