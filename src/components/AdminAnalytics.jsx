import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Eye, Clock, RefreshCw, Loader2 } from 'lucide-react';
import { fetchAnalytics, fetchLeadSources, fetchPricingFunnel } from '../firebase';
import { isAnalyticsEventPath, summarizeRecentEnquiries } from '../enquiryTracking';

const activityRate = new Intl.NumberFormat('en', { maximumFractionDigits: 1 });

const AdminAnalytics = () => {
  const [views, setViews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [funnel, setFunnel] = useState(null);
  const [sources, setSources] = useState(null);

  const loadAnalytics = async () => {
    setLoading(true);
    setError('');
    try {
      const [recentViews, pricing, leadActivity] = await Promise.allSettled([fetchAnalytics(), fetchPricingFunnel(), fetchLeadSources()]);
      setFunnel(pricing.status === 'fulfilled' ? pricing.value : null);
      setSources(leadActivity.status === 'fulfilled' ? leadActivity.value : null);
      if (recentViews.status === 'rejected') throw recentViews.reason;
      setViews(recentViews.value);
    } catch (loadError) {
      console.error('Unable to load analytics:', loadError);
      setError('Analytics could not be loaded. Deploy the updated Firestore rules and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAnalytics(); }, []);

  const stats = useMemo(() => {
    const pageViews = views.filter((view) => !isAnalyticsEventPath(view.path));
    const now = new Date();
    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(now);
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - (6 - index));
      return { date, label: date.toLocaleDateString('en-US', { weekday: 'short' }), views: 0 };
    });
    const pages = {};
    pageViews.forEach((view) => {
      const path = view.path || '/';
      pages[path] = (pages[path] || 0) + 1;
      const date = view.timestamp?.toDate?.();
      const day = date && days.find(({ date: itemDate }) => itemDate.toDateString() === date.toDateString());
      if (day) day.views += 1;
    });
    return { totalViews: pageViews.length, todayViews: days[6]?.views || 0, pages: Object.entries(pages).sort((a, b) => b[1] - a[1]), days };
  }, [views]);

  if (loading) return <div className="py-16 text-center text-gray-400"><Loader2 className="w-9 h-9 mx-auto mb-3 animate-spin text-nhubx-glow-primary" />Loading live analytics...</div>;
  if (error) return <div className="glass rounded-2xl border border-red-500/20 p-8 text-center"><p className="text-red-300 mb-4">{error}</p><button onClick={loadAnalytics} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15"><RefreshCw size={16} /> Try again</button></div>;

  const maxDailyViews = Math.max(1, ...stats.days.map((day) => day.views));
  const maxPageViews = Math.max(1, ...stats.pages.map(([, count]) => count));
  const recent = summarizeRecentEnquiries(views);

  return (
    <div className="space-y-6">
      <section aria-labelledby="pricing-funnel-title" className="glass rounded-2xl border border-white/10 p-6">
        <h3 id="pricing-funnel-title" className="text-xl font-bold mb-2">Pricing enquiry activity</h3>
        <p className="text-sm text-gray-400 mb-5">All recorded activity. WhatsApp clicks record when someone opens the chat link.</p>
        {funnel ? (
          <dl className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {[['Pricing page views', funnel.visit], ['Enquiry forms opened', funnel.open], ['Enquiries sent', funnel.submitted], ['Home WhatsApp clicks', funnel.whatsappHome], ['Pricing WhatsApp clicks', funnel.whatsappPricing], ['Service page WhatsApp clicks', funnel.whatsappService]].map(([label, value]) => (
              <div key={label}><dt className="text-sm text-gray-400">{label}</dt><dd className="mt-1 text-2xl font-bold">{value.toLocaleString()}</dd></div>
            ))}
          </dl>
        ) : <p className="text-gray-400">Pricing activity could not be loaded. Refresh analytics to try again.</p>}
        <div className="mt-5 border-t border-white/10 pt-5">
          <h4 className="font-semibold">Form activity in the last 7 days</h4>
          <p className="mt-1 text-sm text-gray-400">Based on the latest 1,000 events. Repeat actions are counted separately.</p>
          <dl className="mt-3 grid gap-3 sm:grid-cols-2">
            {[['Form opens per 100 pricing views', recent.opensPer100Visits], ['Submissions per 100 form opens', recent.submissionsPer100Opens]].map(([label, value]) => (
              <div key={label}><dt className="text-sm text-gray-400">{label}</dt><dd className="font-semibold">{value === null ? 'Insufficient activity' : activityRate.format(value)}</dd></div>
            ))}
          </dl>
        </div>
      </section>
      <section aria-labelledby="lead-source-title" className="glass rounded-2xl border border-white/10 p-6">
        <h3 id="lead-source-title" className="text-xl font-bold">Lead sources</h3>
        <p className="mb-4 mt-1 text-sm text-gray-400">First source in each browser session. Enquiries count completed website forms. Counts start when source tracking was added.</p>
        {sources ? (
          <table className="w-full text-left text-sm">
            <thead className="text-gray-300"><tr><th scope="col" className="pb-2">Source</th><th scope="col" className="pb-2 text-right">Visits</th><th scope="col" className="pb-2 text-right">Enquiries</th></tr></thead>
            <tbody className="divide-y divide-white/10">
              {sources.map(({ source, label, visits, enquiries }) => (
                <tr key={source}><th scope="row" className="py-2 font-medium">{label}</th><td className="text-right">{visits.toLocaleString()}</td><td className="text-right">{enquiries.toLocaleString()}</td></tr>
              ))}
            </tbody>
          </table>
        ) : <p className="text-sm text-gray-400">Lead sources could not be loaded.</p>}
      </section>
      <div className="grid sm:grid-cols-3 gap-4">
        {[['Recorded views', stats.totalViews, Eye, 'text-blue-400'], ['Views today', stats.todayViews, Clock, 'text-green-400'], ['Tracked pages', stats.pages.length, BarChart3, 'text-purple-400']].map(([label, value, Icon, color]) => <div key={label} className="glass rounded-2xl border border-white/10 p-6"><Icon className={`${color} mb-4`} /><p className="text-gray-400 text-sm">{label}</p><p className="text-3xl font-bold">{value.toLocaleString()}</p></div>)}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass rounded-2xl border border-white/10 p-6"><h3 className="text-xl font-bold mb-6">Views by page</h3><div className="space-y-4">{stats.pages.length === 0 && <p className="text-gray-500 text-sm">No page views have been recorded yet.</p>}{stats.pages.map(([path, count]) => <div key={path}><div className="flex justify-between text-sm mb-2"><span className="text-gray-300">{path}</span><span>{count}</span></div><div className="h-2 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-nhubx-glow-primary" style={{ width: `${(count / maxPageViews) * 100}%` }} /></div></div>)}</div></div>
        <div className="glass rounded-2xl border border-white/10 p-6"><h3 className="text-xl font-bold mb-6">Last 7 days</h3><div className="h-48 flex items-end gap-3">{stats.days.map((day) => <div key={day.date.toISOString()} className="flex-1 h-full flex flex-col justify-end items-center gap-2"><span className="text-xs text-gray-400">{day.views}</span><motion.div initial={{ height: 0 }} animate={{ height: `${Math.max(3, (day.views / maxDailyViews) * 100)}%` }} className="w-full rounded-t-lg bg-gradient-to-t from-nhubx-glow-primary to-orange-300" /><span className="text-xs text-gray-500">{day.label}</span></div>)}</div></div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
