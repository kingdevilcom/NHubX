export async function firebaseServer() {
  const [{ cert, getApps, initializeApp }, { getAuth }, { getFirestore }] = await Promise.all([
    import('firebase-admin/app'), import('firebase-admin/auth'), import('firebase-admin/firestore'),
  ]);
  let app = getApps().find((item) => item.name === 'nhubx-orders');
  if (!app) {
    if (!process.env.FIREBASE_ADMIN_CREDENTIALS) return null;
    const credentials = JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS);
    if (credentials.project_id !== 'nhubx-fc6d8') throw new Error('Wrong Firebase project for orders.');
    app = initializeApp({ credential: cert(credentials) }, 'nhubx-orders');
  }
  return { auth: getAuth(app), db: getFirestore(app) };
}
