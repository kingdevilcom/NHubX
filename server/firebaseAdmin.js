export async function firebaseServer() {
  const { default: admin } = await import('firebase-admin');
  let app = admin.apps.find((item) => item.name === 'nhubx-orders');
  if (!app) {
    if (!process.env.FIREBASE_ADMIN_CREDENTIALS) return null;
    const credentials = JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS);
    if (credentials.project_id !== 'nhubx-fc6d8') throw new Error('Wrong Firebase project for orders.');
    app = admin.initializeApp({ credential: admin.credential.cert(credentials) }, 'nhubx-orders');
  }
  return { auth: admin.auth(app), db: admin.firestore(app) };
}
