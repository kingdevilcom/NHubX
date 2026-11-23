export const entryPlan = Object.freeze({ name: 'Mini', price: '4,999' });

export function whatsappEnquiryUrl(planName) {
  const message = 'Hi NHubX! I’m interested in the ' + planName + ' website plan. Could you help me with a quote?';
  return 'https://wa.me/94740356525?text=' + encodeURIComponent(message);
}
