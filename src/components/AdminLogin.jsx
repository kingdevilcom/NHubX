import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { orderButton } from '../orders';

export default function AdminLogin() {
  const { loginWithGoogle } = useAdmin();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function signIn() {
    setError('');
    setLoading(true);
    try { await loginWithGoogle(); }
    catch (err) { if (err.code !== 'auth/popup-closed-by-user') setError(err.message || 'Unable to sign in.'); }
    finally { setLoading(false); }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-[#101011] px-4 py-12">
      <section className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#19191b] p-6 sm:p-8">
        <img src="/nhubx-logo.png" alt="" width="48" height="48" className="mb-5 rounded-xl" />
        <h1 className="text-3xl font-black tracking-tight">NHubX Admin</h1>
        <p className="mt-2 text-sm text-gray-400">Sign in with the Google account that manages NHubX.</p>
        {error && <p className="mt-4 text-sm text-red-300" role="alert">{error}</p>}
        <button type="button" disabled={loading} onClick={signIn} className={orderButton + ' mt-6 w-full'}>{loading ? 'Signing in…' : 'Continue with Google'}</button>
        <Link to="/" className="mt-4 block text-center text-sm text-gray-400 hover:text-white">Back to website</Link>
      </section>
    </div>
  );
}
