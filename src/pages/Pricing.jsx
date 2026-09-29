import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ChevronRight, Database, Globe2, Loader2, Send, Server, X } from 'lucide-react';
import { saveMessage } from '../firebase';

const plans = [
  {
    name: 'Mini', price: '4,999', description: 'A clean online presence for individuals and small businesses.', hosting: 'LKR 499/year', features: ['Custom one-page website', 'Responsive on every screen', 'About, services and contact sections', 'WhatsApp and social links', 'Basic SEO and animations', 'One revision']
  },
  {
    name: 'Launch Bundle', price: '6,999', description: 'Everything needed to launch and become discoverable online.', hosting: 'LKR 499/year', features: ['Everything in Mini', 'Domain connection', 'DNS configuration', 'Google Search Console', 'XML sitemap submission', 'Google Analytics setup']
  },
  {
    name: 'Starter', price: '9,999', description: 'A multi-page website for brands and growing local businesses.', hosting: 'LKR 2,000/year', popular: true, features: ['Up to three custom pages', 'Contact form', 'Custom animations', 'Analytics and basic SEO', 'Free DNS, GSC and sitemap setup', 'Two revisions and 14 days support']
  },
  {
    name: 'Business', price: '19,999', description: 'A complete professional website with stronger content and integrations.', hosting: 'LKR 2,000/year', features: ['Up to five custom pages', 'Advanced contact form', 'Maps, WhatsApp and social links', 'Performance optimization', 'Free DNS, GSC and sitemap setup', 'Three revisions and 30 days support']
  },
  {
    name: 'Advanced', price: '39,999+', description: 'Dynamic websites with authentication and management features.', hosting: 'From LKR 2,000/year', features: ['Up to eight custom pages', 'Database integration', 'Google authentication', 'Admin dashboard', 'Editable website content', 'Four revisions and 60 days support']
  }
];

const addons = [
  ['Additional page', 'LKR 1,500'], ['Additional revision', 'LKR 500'], ['Domain connection', 'LKR 500'], ['DNS setup', 'LKR 500'], ['Google Search Console', 'LKR 1,000'], ['Sitemap submission', 'LKR 500'], ['Google Analytics', 'LKR 1,000'], ['Content update', 'From LKR 1,000'], ['Professional email setup', 'From LKR 1,500'], ['Annual maintenance', 'LKR 2,500'], ['Google authentication', 'From LKR 5,000'], ['Admin dashboard', 'From LKR 15,000']
];

const Pricing = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [form, setForm] = useState({ name: '', whatsapp: '', email: '', details: '' });
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  useEffect(() => { document.title = 'Pricing | NHubX'; }, []);

  useEffect(() => {
    document.body.style.overflow = selectedPlan ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedPlan]);

  const openPlanForm = (plan) => {
    setSelectedPlan(plan);
    setStatus('idle');
    setError('');
  };

  const closePlanForm = () => {
    if (status !== 'loading') setSelectedPlan(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('loading');
    setError('');

    const enquiry = [
      `Pricing plan enquiry: ${selectedPlan.name}`,
      `Development price: LKR ${selectedPlan.price}`,
      `Hosting: ${selectedPlan.hosting}`,
      `WhatsApp: ${form.whatsapp}`,
      form.details ? `Project details: ${form.details}` : 'Project details: Not provided'
    ].join('\n');

    try {
      await saveMessage(form.name.trim(), form.email.trim(), enquiry);
      setStatus('success');
      setForm({ name: '', whatsapp: '', email: '', details: '' });
    } catch (submitError) {
      console.error('Unable to submit plan enquiry:', submitError);
      setError('Your enquiry could not be sent. Please try again.');
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <header className="max-w-3xl mx-auto text-center mb-14">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-nhubx-glow-primary mb-4">Simple Sri Lankan pricing</p>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-5">A website plan for every stage.</h1>
          <p className="text-gray-500 leading-relaxed">Custom websites with transparent development, setup and annual hosting costs. Choose a starting point and we’ll confirm the final scope before work begins.</p>
        </header>

        <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-4 items-stretch">
          {plans.map((plan) => (
            <article key={plan.name} className={`relative flex flex-col rounded-2xl border p-6 ${plan.popular ? 'border-nhubx-glow-primary/60 bg-nhubx-glow-primary/[0.07] shadow-glow' : 'border-white/[0.08] bg-white/[0.02]'}`}>
              {plan.popular && <span className="absolute -top-3 left-5 rounded-full bg-nhubx-glow-primary px-3 py-1 text-[9px] font-black uppercase tracking-wider">Most popular</span>}
              <h2 className="text-xl font-bold">{plan.name}</h2>
              <p className="mt-3 min-h-16 text-xs leading-relaxed text-gray-500">{plan.description}</p>
              <div className="my-6"><span className="text-xs text-gray-500">LKR</span><p className="text-3xl font-black text-white">{plan.price}</p><p className="text-[10px] uppercase tracking-wider text-gray-600">development</p></div>
              <ul className="space-y-3 flex-1">{plan.features.map((feature) => <li key={feature} className="flex items-start gap-2 text-xs text-gray-400"><Check size={14} className="text-nhubx-glow-primary shrink-0 mt-0.5" />{feature}</li>)}</ul>
              <div className="mt-6 pt-4 border-t border-white/[0.06]"><p className="text-[10px] uppercase tracking-wider text-gray-600">Hosting</p><p className="text-sm font-semibold mt-1">{plan.hosting}</p></div>
              <button onClick={() => openPlanForm(plan)} className={`mt-5 inline-flex items-center justify-center gap-1 rounded-xl py-3 text-xs font-bold uppercase tracking-wider transition-colors ${plan.popular ? 'bg-nhubx-glow-primary hover:bg-orange-500' : 'bg-white/[0.05] hover:bg-white/[0.1]'}`}>Choose plan <ChevronRight size={14} /></button>
            </article>
          ))}
        </div>

        <section className="mt-20 grid lg:grid-cols-2 gap-8">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8"><h2 className="text-2xl font-bold mb-2">Optional add-ons</h2><p className="text-sm text-gray-500 mb-6">Add only what your project needs.</p><div className="divide-y divide-white/[0.06]">{addons.map(([name, price]) => <div key={name} className="flex items-center justify-between gap-4 py-3 text-sm"><span className="text-gray-400">{name}</span><span className="font-semibold text-white text-right">{price}</span></div>)}</div></div>

          <div className="space-y-5">
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8"><Database className="text-nhubx-glow-primary mb-4" /><h2 className="text-xl font-bold mb-3">Database and provider costs</h2><p className="text-sm leading-relaxed text-gray-500">Development prices cover database setup and integration only. Firebase, storage, bandwidth, authentication, cloud functions, paid APIs and other provider usage are paid directly by the customer.</p></div>
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8"><Server className="text-nhubx-glow-primary mb-4" /><h2 className="text-xl font-bold mb-3">Hosting and domains</h2><p className="text-sm leading-relaxed text-gray-500">Hosting is renewed annually and is not free with any plan. Domain registration is charged separately at the registrar’s current price. High-traffic or backend-heavy projects may need custom hosting.</p></div>
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8"><Globe2 className="text-nhubx-glow-primary mb-4" /><h2 className="text-xl font-bold mb-3">Payment terms</h2><p className="text-sm leading-relaxed text-gray-500">40% to begin, 30% after design approval and 30% before launch. Work outside the approved scope is quoted separately.</p></div>
          </div>
        </section>

        <section className="mt-16 rounded-2xl border border-nhubx-glow-primary/20 bg-nhubx-glow-primary/[0.06] p-8 sm:p-12 text-center"><h2 className="text-3xl sm:text-4xl font-black">Need something more specific?</h2><p className="mt-3 text-gray-500">E-commerce, booking systems, AI tools and custom platforms are quoted according to scope.</p><Link to="/contact" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-nhubx-glow-primary px-6 py-3 text-xs font-bold uppercase tracking-wider">Request a quote <ChevronRight size={15} /></Link></section>
      </div>

      {selectedPlan && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
          <button aria-label="Close enquiry form" onClick={closePlanForm} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <div role="dialog" aria-modal="true" aria-labelledby="plan-form-title" className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0b0b0b] p-6 sm:p-8 shadow-2xl">
            <div className="flex items-start justify-between gap-4 mb-7">
              <div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-nhubx-glow-primary mb-2">Plan enquiry</p><h2 id="plan-form-title" className="text-2xl sm:text-3xl font-black">{selectedPlan.name}</h2><p className="text-sm text-gray-500 mt-1">LKR {selectedPlan.price} · Hosting {selectedPlan.hosting}</p></div>
              <button onClick={closePlanForm} disabled={status === 'loading'} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white disabled:opacity-50"><X size={19} /></button>
            </div>

            {status === 'success' ? (
              <div className="py-8 text-center"><div className="w-14 h-14 mx-auto mb-5 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center"><Check className="text-green-400" /></div><h3 className="text-2xl font-bold">Enquiry received</h3><p className="text-gray-500 mt-3 max-w-sm mx-auto">Thank you. NHubX can contact you using the details you provided.</p><button onClick={closePlanForm} className="mt-7 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-sm font-semibold">Close</button></div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <label className="block"><span className="block text-xs font-semibold text-gray-300 mb-2">Your name</span><input required maxLength="80" autoComplete="name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Enter your name" className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white placeholder-gray-600 outline-none focus:border-nhubx-glow-primary/60" /></label>
                <div className="grid sm:grid-cols-2 gap-5">
                  <label className="block"><span className="block text-xs font-semibold text-gray-300 mb-2">WhatsApp number</span><input required type="tel" maxLength="20" autoComplete="tel" value={form.whatsapp} onChange={(event) => setForm({ ...form, whatsapp: event.target.value })} placeholder="+94 7X XXX XXXX" pattern="[+0-9 ()-]{7,20}" className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white placeholder-gray-600 outline-none focus:border-nhubx-glow-primary/60" /></label>
                  <label className="block"><span className="block text-xs font-semibold text-gray-300 mb-2">Email address</span><input required type="email" maxLength="120" autoComplete="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="you@example.com" className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white placeholder-gray-600 outline-none focus:border-nhubx-glow-primary/60" /></label>
                </div>
                <label className="block"><span className="block text-xs font-semibold text-gray-300 mb-2">Project details <span className="text-gray-600">(optional)</span></span><textarea rows="4" maxLength="1000" value={form.details} onChange={(event) => setForm({ ...form, details: event.target.value })} placeholder="Tell us what you want to build..." className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white placeholder-gray-600 outline-none focus:border-nhubx-glow-primary/60" /></label>
                {error && <p className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}
                <p className="text-[11px] leading-relaxed text-gray-600">By submitting, you allow NHubX to contact you about this project through WhatsApp or email.</p>
                <button type="submit" disabled={status === 'loading'} className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-nhubx-glow-primary hover:bg-orange-500 disabled:opacity-60 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors">{status === 'loading' ? <><Loader2 size={16} className="animate-spin" /> Sending enquiry</> : <><Send size={16} /> Send enquiry</>}</button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Pricing;
