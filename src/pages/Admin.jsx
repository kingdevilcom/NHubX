import { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowUpRight, BarChart3, Layers, Loader2, LogOut, Mail, Package, RefreshCw, Settings } from 'lucide-react';
import { AdminProvider, useAdmin } from '../context/AdminContext';
import AdminLogin from '../components/AdminLogin';
import AdminAnalytics from '../components/AdminAnalytics';
import AdminProjectManager from '../components/AdminProjectManager';
import AdminContentEditor from '../components/AdminContentEditor';
import AdminMessages from '../components/AdminMessages';
import AdminOrders from '../components/AdminOrders';
import { fetchProjects } from '../firebase';

const sections = [
  { id: 'orders', label: 'Orders', description: 'Manage quotes, delivery, payments and renewals.', icon: Package },
  { id: 'messages', label: 'Enquiries', description: 'Review incoming messages and turn enquiries into quotes.', icon: Mail },
  { id: 'analytics', label: 'Analytics', description: 'Track website traffic and where leads come from.', icon: BarChart3 },
  { id: 'projects', label: 'Projects', description: 'Manage the public project portfolio.', icon: Layers },
  { id: 'content', label: 'Site content', description: 'Update website content and the active fire theme.', icon: Settings },
];

function AdminProjects() {
  const [projects, setProjects] = useState(null);
  const [error, setError] = useState('');
  const load = useCallback(async () => {
    setError('');
    try { setProjects((await fetchProjects()).map((project, index) => ({ ...project, sortOrder: index }))); }
    catch { setError('Projects could not be loaded. Check your connection and try again.'); }
  }, []);
  useEffect(() => { load(); }, [load]);

  if (error) return <div role="alert" className="rounded-xl border border-red-500/25 p-5 text-red-300">{error}<button type="button" onClick={load} className="ml-3 inline-flex items-center gap-2 underline"><RefreshCw size={14} />Try again</button></div>;
  if (!projects) return <p role="status" className="flex items-center gap-2 text-gray-400"><Loader2 size={18} className="motion-safe:animate-spin" /> Loading projects…</p>;
  return <AdminProjectManager projects={projects} setProjects={setProjects} />;
}

function Admin() {
  const { isAuthenticated, isAuthLoading, logout, user } = useAdmin();
  const [params, setParams] = useSearchParams();
  const section = sections.find(({ id }) => id === params.get('tab')) ?? sections[0];
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { document.title = 'Admin workspace | NHubX'; }, []);

  async function handleLogout() {
    setSigningOut(true);
    setError('');
    try { await logout(); }
    catch { setError('Could not sign out. Please try again.'); }
    finally { setSigningOut(false); }
  }

  if (isAuthLoading) return <div className="grid min-h-screen place-items-center bg-[#101011]"><p role="status" className="flex items-center gap-2 text-gray-300"><Loader2 size={20} className="motion-safe:animate-spin" /> Checking admin session…</p></div>;
  if (!isAuthenticated) return <AdminLogin />;

  return (
    <div className="min-h-screen bg-[#101011] text-white">
      <div className="mx-auto grid max-w-[1500px] lg:grid-cols-[15rem_minmax(0,1fr)]">
        <aside className="min-w-0 border-b border-white/10 bg-[#151516] px-4 py-4 lg:min-h-screen lg:border-b-0 lg:border-r lg:px-5 lg:py-6">
          <div className="flex items-center justify-between gap-3">
            <Link to="/" className="flex items-center gap-2.5 font-bold"><img src="/nhubx-logo.png" width="34" height="34" alt="" className="rounded-lg" /> NHubX Admin</Link>
            <Link to="/" className="rounded-lg border border-white/10 p-2 text-gray-300 lg:hidden" aria-label="View website"><ArrowUpRight size={16} /></Link>
          </div>
          <nav aria-label="Admin sections" className="mt-4 flex gap-1 overflow-x-auto pb-1 lg:mt-8 lg:grid lg:overflow-visible">
            {sections.map(({ id, icon: Icon, label }) => (
              <button key={id} type="button" aria-current={section.id === id ? 'page' : undefined} onClick={() => setParams({ tab: id }, { replace: true })}
                className={`flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-sm font-semibold ${section.id === id ? 'border-nhubx-glow-primary/35 bg-nhubx-glow-primary/10 text-nhubx-glow-primary' : 'border-transparent text-gray-300 hover:bg-white/5'}`}>
                <Icon size={17} aria-hidden="true" />{label}
              </button>
            ))}
          </nav>
          <Link to="/" className="mt-6 hidden items-center gap-2 px-3 text-sm text-gray-400 hover:text-white lg:flex">View website <ArrowUpRight size={15} /></Link>
        </aside>

        <div className="min-w-0 px-4 pb-14 pt-5 sm:px-7 lg:pt-8">
          <header className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-5">
            <div><h1 className="text-3xl font-black tracking-tight sm:text-4xl">{section.label}</h1><p className="mt-1.5 text-sm text-gray-400">{section.description}</p></div>
            <div className="flex max-w-full items-center gap-2">
              <span className="hidden max-w-48 truncate text-sm text-gray-400 sm:inline">{user?.displayName || user?.email}</span>
              <button type="button" onClick={handleLogout} disabled={signingOut} className="flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-sm text-gray-300 hover:bg-white/5 disabled:opacity-50"><LogOut size={16} aria-hidden="true" />{signingOut ? 'Signing out…' : 'Sign out'}</button>
            </div>
          </header>
          {error && <p className="mb-4 text-sm text-red-300" role="alert">{error}</p>}
          {section.id === 'orders' && <AdminOrders />}
          {section.id === 'messages' && <AdminMessages />}
          {section.id === 'analytics' && <AdminAnalytics />}
          {section.id === 'projects' && <AdminProjects />}
          {section.id === 'content' && <AdminContentEditor />}
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return <AdminProvider><Admin /></AdminProvider>;
}
