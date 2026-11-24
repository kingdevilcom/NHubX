# React + Vite

## Orders on Vercel

The order API and the daily renewal job run on Vercel. They use the existing Firebase project, with no Firebase Cloud Functions required. Enable Google sign-in in Firebase Authentication and authorize the website domain. Customers use the Google account matching their quote email.

Set these variables under **Vercel → Project → Settings → Environment Variables** for Production and redeploy:

| Variable | Value |
| --- | --- |
| `FIREBASE_ADMIN_CREDENTIALS` | The Firebase server service-account JSON for `nhubx-fc6d8`, entered as a secret. |
| `RESEND_API_KEY` | A replacement Resend Full Access key. This one key can send email and sync Contacts. |
| `ORDER_EMAIL_FROM` | `orders@email.nhubx.com`, after verifying `email.nhubx.com` in Resend. |
| `CRON_SECRET` | A random secret of at least 32 characters. Vercel passes it to the renewal job. |

Approve a test quote and test renewal before using real customer data. Customers synced to Contacts are created unsubscribed from Broadcasts. Existing contacts keep their current subscription status. The order portal shows bank-transfer payments once an admin records them.

## NHubX enquiry alerts

Vercel deploys the website. Inbox stage permissions and email alerts deploy separately to Firebase project `nhubx-fc6d8`.

1. Sign into Firebase CLI with an account that can deploy rules and functions for the project. Publish changes to the inbox permissions with `npx firebase-tools deploy --only firestore:rules --project nhubx-fc6d8`.
2. For email alerts, enable Cloud Functions on the project, verify the sending domain in Resend, and store its sending key with `npx firebase-tools functions:secrets:set RESEND_API_KEY --project nhubx-fc6d8`. Keep the key in Secret Manager.
3. Run `npm ci --prefix functions`, then `npx firebase-tools deploy --only functions:notifyEnquiry --project nhubx-fc6d8`. Set `ENQUIRY_ALERT_FROM` to the verified sender, `ENQUIRY_ALERT_TO` to the owner's private inbox, and `ENQUIRY_ALERT_REGION` to the region appropriate for the Firestore database when prompted.

Alerts link to the signed-in Admin inbox and contain no customer details. Enquiries created in the same five-minute window share one alert.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
