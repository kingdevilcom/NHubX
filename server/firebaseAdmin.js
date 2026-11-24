export class FirebaseConfigError extends Error {}

export function parseFirebaseCredentials(value) {
  let credentials;
  try {
    credentials = JSON.parse(value.trim().replace(/^\uFEFF/, ''));
  } catch {
    throw new FirebaseConfigError('FIREBASE_ADMIN_CREDENTIALS must contain valid service-account JSON.');
  }
  if (credentials?.type !== 'service_account' || typeof credentials.client_email !== 'string' || typeof credentials.private_key !== 'string') {
    throw new FirebaseConfigError('FIREBASE_ADMIN_CREDENTIALS must contain the downloaded Firebase service-account JSON, including its private key.');
  }
  if (credentials.project_id !== 'nhubx-fc6d8') {
    throw new FirebaseConfigError('Use service-account credentials for Firebase project nhubx-fc6d8.');
  }
  return { ...credentials, private_key: credentials.private_key.replace(/\\n/g, '\n') };
}

export async function firebaseServer() {
  const { default: admin } = await import('firebase-admin');
  let app = admin.apps.find((item) => item.name === 'nhubx-orders');
  if (!app) {
    if (!process.env.FIREBASE_ADMIN_CREDENTIALS) return null;
    const credentials = parseFirebaseCredentials(process.env.FIREBASE_ADMIN_CREDENTIALS);
    try {
      app = admin.initializeApp({ credential: admin.credential.cert(credentials) }, 'nhubx-orders');
    } catch (error) {
      if (error.code === 'app/invalid-credential') throw new FirebaseConfigError('The Firebase service-account private key is invalid. Copy the complete downloaded JSON.');
      throw error;
    }
  }
  return { auth: admin.auth(app), db: admin.firestore(app) };
}
