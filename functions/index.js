import { defineSecret, defineString } from 'firebase-functions/params';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { sendEnquiryAlert } from './enquiryAlert.js';

const apiKey = defineSecret('RESEND_API_KEY');
const sender = defineString('ENQUIRY_ALERT_FROM');
const recipient = defineString('ENQUIRY_ALERT_TO');
const region = defineString('ENQUIRY_ALERT_REGION', { default: 'us-central1' });

export const notifyEnquiry = onDocumentCreated({
  document: 'messages/{messageId}',
  region,
  secrets: [apiKey],
  retry: true,
  timeoutSeconds: 20,
  maxInstances: 1,
}, async (event) => {
  if (!event.data) return;
  await sendEnquiryAlert({
    createdAt: event.time,
    from: sender.value(),
    to: recipient.value(),
    apiKey: apiKey.value(),
  });
});
