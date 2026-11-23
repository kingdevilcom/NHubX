import { parsePhoneNumberFromString } from 'libphonenumber-js/min';

export function preparePlanEnquiry(plan, form) {
  const name = form.name.trim();
  if (name.length < 2) return { field: 'name', error: 'Enter at least two characters for your name.' };

  const phone = parsePhoneNumberFromString(form.whatsapp, { defaultCountry: form.country, extract: false });
  if (!phone?.isPossible()) return { field: 'whatsapp', error: 'Enter a valid WhatsApp number for the selected country.' };

  const email = form.email.trim();
  if (email.length < 4) return { field: 'email', error: 'Enter your email address.' };

  const details = form.details.trim();
  return {
    name,
    email,
    message: [
      `Pricing plan enquiry: ${plan.name}`,
      `Development price: LKR ${plan.price}`,
      `Hosting: ${plan.hosting}`,
      `WhatsApp: ${phone.formatInternational()}`,
      details ? `Project details: ${details}` : 'Project details: Not provided',
    ].join('\n'),
  };
}
