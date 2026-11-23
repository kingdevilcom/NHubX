import { parsePhoneNumberFromString } from 'libphonenumber-js/min';

export function preparePlanEnquiry(plan, form) {
  const name = form.name.trim();
  if (name.length < 2) return { field: 'name', error: 'Enter at least two characters for your name.' };

  const email = form.email.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { field: 'email', error: 'Enter a valid email address so we can reply.' };

  const number = form.whatsapp.trim();
  const phone = number ? parsePhoneNumberFromString(number, { defaultCountry: form.country, extract: false }) : undefined;
  if (number && !phone?.isPossible()) return { field: 'whatsapp', error: 'Enter a valid WhatsApp number or leave this field blank.' };

  const details = form.details.trim();
  return {
    name,
    email,
    message: [
      `Pricing plan enquiry: ${plan.name}`,
      `Development price: LKR ${plan.price}`,
      `Hosting: ${plan.hosting}`,
      phone ? `WhatsApp: ${phone.formatInternational()}` : 'WhatsApp: Not provided',
      details ? `Project details: ${details}` : 'Project details: Not provided',
    ].join('\n'),
  };
}
