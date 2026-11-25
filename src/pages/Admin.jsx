import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowUpRight, BarChart3, ChevronDown, ChevronRight, Layers, Loader2, LogOut, Mail, Package, RefreshCw, Send, Settings, Star } from 'lucide-react';
import { AdminProvider, useAdmin } from '../context/AdminContext';
import AdminLogin from '../components/AdminLogin';
import AdminAnalytics from '../components/AdminAnalytics';
import AdminProjectManager from '../components/AdminProjectManager';
import AdminContentEditor from '../components/AdminContentEditor';
import AdminMessages from '../components/AdminMessages';
import AdminOrders from '../components/AdminOrders';
import AdminReviews from '../components/AdminReviews';
import AdminEmail from '../components/AdminEmail';
import { fetchProjects } from '../firebase';

const groups = [
  { label: 'Orders', sections: [
    { id: 'orders', label: 'Orders', description: 'Manage quotes, delivery, payments and renewals.', icon: Package, content: AdminOrders },
    { id: 'reviews', label: 'Reviews', description: 'Moderate reviews from customers with delivered orders.', icon: Star, content: AdminReviews },
  ] },
  { label: 'Communication', sections: [
    { id: 'messages', label: 'Enquiries', description: 'Review incoming messages and turn enquiries into quotes.', icon: Mail, content: AdminMessages },
    { id: 'email', label: 'Email', description: 'Compose email, read your inbox and find replies to sent messages.', icon: Send, content: AdminEmail },
  ] },
  { label: 'Website', sections: [
    { id: 'projects', label: 'Projects', description: 'Manage the public project portfolio.', icon: Layers, content: AdminProjects },
    { id: 'content', label: 'Site content', description: 'Update website content and the active fire theme.', icon: Settings, content: AdminContentEditor },
    { id: 'analytics', label: 'Analytics', description: 'Track website traffic and where leads come from.', icon: BarChart3, content: AdminAnalytics },
  ] },
];
const sections = groups.flatMap((group) => group.sections.map((section) => ({ ...section, group: group.label })));
const adminLink = (id) => '/admin?tab=' + id;

function AdminNavigation({ active, onNavigate }) {
  return (
    <nav aria-label="Admin sections" className="space-y-5">
      {groups.map((group) => (
        <div key={group.label}>
          <p className="mb-2 px-3 text-xs font-semibold text-gray-400">{group.label}</p>
          <ul className="space-y-1">
            {group.sections.map(({ id, label, icon: Icon }) => (
              <li key={id}>
                <Link to={adminLink(id)} replace aria-current={active === id ? 'page' : undefined} onClick={(event) => {
                  if (active === id) event.preventDefault();
                  onNavigate?.();
                }} className="flex items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-nhubx-glow-primary aria-[current=page]:border-nhubx-glow-primary/30 aria-[current=page]:bg-nhubx-glow-primary/10 aria-[current=page]:text-nhubx-glow-primary">
                  <Icon size={17} aria-hidden="true" />
                  {label}
                  {active === id && <ChevronRight size={15} aria-hidden="true" className="ml-auto" />}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

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
  return <div className="space-y-4">
    <Link to="/admin?tab=reviews&view=published" className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-sm font-semibold text-nhubx-glow-primary hover:bg-white/5"><Star size={16} aria-hidden="true" /> Link customer reviews to projects</Link>
    <AdminProjectManager projects={projects} setProjects={setProjects} />
  </div>;
}

function Admin() {
  const { isAuthenticated, isAuthLoading, logout, user } = useAdmin();
  const [params] = useSearchParams();
  const section = sections.find(({ id }) => id === params.get('tab')) ?? sections[0];
  const { icon: ActiveIcon, content: SectionContent } = section;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef(null);
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
      <div className="mx-auto grid max-w-[1680px] lg:grid-cols-[15rem_minmax(0,1fr)]">
        <aside onKeyDown={(event) => {
          if (event.key === 'Escape' && menuOpen) {
            setMenuOpen(false);
            menuButton.current?.focus();
          }
        }} className="min-w-0 border-b border-white/10 bg-[#151516] px-4 py-4 lg:sticky lg:top-0 lg:flex lg:h-dvh lg:flex-col lg:self-start lg:overflow-y-auto lg:border-b-0 lg:border-r lg:px-5 lg:py-6">
          <Link to={adminLink('orders')} onClick={() => setMenuOpen(false)} className="mb-4 flex items-center gap-3 font-bold lg:mb-8">
            <img src="/nhubx-logo.png" width="36" height="36" alt="" className="rounded-lg" /> NHubX Admin
          </Link>
          <button ref={menuButton} type="button" aria-expanded={menuOpen} aria-controls="admin-mobile-navigation" onClick={() => setMenuOpen((open) => !open)} className="flex w-full items-center gap-2 rounded-lg border border-white/15 px-3 py-2.5 text-left text-sm font-semibold text-gray-200 lg:hidden">
            <ActiveIcon size={17} aria-hidden="true" className="text-nhubx-glow-primary" />
            <span className="sr-only">Admin sections</span>
            {section.label}
            <ChevronDown size={17} aria-hidden="true" className={menuOpen ? 'ml-auto rotate-180' : 'ml-auto'} />
          </button>
          <div id="admin-mobile-navigation" hidden={!menuOpen} className="mt-4 lg:hidden">
            <AdminNavigation active={section.id} onNavigate={() => {
              setMenuOpen(false);
              menuButton.current?.focus();
            }} />
          </div>
          <div className="hidden lg:block"><AdminNavigation active={section.id} /></div>
          <Link to="/" className="mt-auto hidden items-center gap-2 border-t border-white/10 px-3 pt-4 text-sm text-gray-300 hover:text-white lg:flex">View website <ArrowUpRight size={15} aria-hidden="true" /></Link>
        </aside>

        <div className="min-w-0 px-4 pb-14 pt-4 sm:px-7 lg:pt-6">
          <header className="mb-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
              <span className="text-sm font-medium text-gray-400">{section.group}</span>
              <div className="flex max-w-full items-center gap-3">
                <span className="hidden max-w-48 truncate text-sm text-gray-400 sm:inline">{user?.displayName || user?.email}</span>
                <Link to="/" className="rounded-lg border border-white/15 p-2 text-gray-300 hover:bg-white/5 lg:hidden" aria-label="View website"><ArrowUpRight size={16} aria-hidden="true" /></Link>
                <button type="button" onClick={handleLogout} disabled={signingOut} className="flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-sm text-gray-300 hover:bg-white/5 disabled:opacity-50"><LogOut size={16} aria-hidden="true" />{signingOut ? 'Signing out…' : 'Sign out'}</button>
              </div>
            </div>
            <div className="mt-5 flex items-start gap-3">
              <div className="rounded-xl border border-nhubx-glow-primary/25 bg-nhubx-glow-primary/10 p-2.5 text-nhubx-glow-primary"><ActiveIcon size={22} aria-hidden="true" /></div>
              <div><h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{section.label}</h1><p className="mt-1 text-sm text-gray-400">{section.description}</p></div>
            </div>
          </header>
          {error && <p className="mb-4 text-sm text-red-300" role="alert">{error}</p>}
          <SectionContent />
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return <AdminProvider><Admin /></AdminProvider>;
}
