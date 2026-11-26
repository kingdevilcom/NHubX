import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Check, ChevronRight, Database, Globe2, Loader2, Send, Server, X } from 'lucide-react';
import { getCountries, getCountryCallingCode } from 'libphonenumber-js/min';
import { saveMessage, trackPricingEvent } from '../firebase';
import PricingGuide from '../components/PricingGuide';
import PricingExamples from '../components/PricingExamples';
import WhatsAppEnquiry from '../components/WhatsAppEnquiry';
import { entryPlan } from '../salesOffer';
import { preparePlanEnquiry } from '../planEnquiry';

const plans = [
  {
    ...entryPlan, bestFor: 'A one-page website', description: 'A clean online presence for individuals and small businesses.', hosting: 'LKR 499/year', features: ['Custom one-page website', 'Responsive on every screen', 'About, services and contact sections', 'WhatsApp and social links', 'Basic SEO and animations', 'One revision']
  },
  {
    name: 'Launch Bundle', bestFor: 'A one-page site with domain and search setup', price: '6,999', description: 'Everything needed to launch and become discoverable online.', hosting: 'LKR 499/year', features: ['Everything in Mini', 'Domain connection', 'DNS configuration', 'Google Search Console', 'XML sitemap submission', 'Google Analytics setup']
  },
  {
    name: 'Starter', bestFor: 'Up to three pages with a contact form', price: '9,999', description: 'A multi-page website for brands and growing local businesses.', hosting: 'LKR 2,000/year', popular: true, features: ['Up to three custom pages', 'Contact form', 'Custom animations', 'Analytics and basic SEO', 'Free DNS, GSC and sitemap setup', 'Two revisions and 14 days support']
  },
  {
    name: 'Business', bestFor: 'Up to five pages with integrations', price: '19,999', description: 'A complete professional website with stronger content and integrations.', hosting: 'LKR 2,000/year', features: ['Up to five custom pages', 'Advanced contact form', 'Maps, WhatsApp and social links', 'Performance optimization', 'Free DNS, GSC and sitemap setup', 'Three revisions and 30 days support']
  },
  {
    name: 'Advanced', bestFor: 'Web apps with login and admin tools', price: '39,999+', description: 'Dynamic websites with authentication and management features.', hosting: 'From LKR 2,000/year', features: ['Up to eight custom pages', 'Database integration', 'Google authentication', 'Admin dashboard', 'Editable website content', 'Four revisions and 60 days support']
  }
];

const addons = [
  ['Additional page', 'LKR 1,500'], ['Additional revision', 'LKR 500'], ['Domain connection', 'LKR 500'], ['DNS setup', 'LKR 500'], ['Google Search Console', 'LKR 1,000'], ['Sitemap submission', 'LKR 500'], ['Google Analytics', 'LKR 1,000'], ['Content update', 'From LKR 1,000'], ['Professional email setup', 'From LKR 1,500'], ['Annual maintenance', 'LKR 2,500'], ['Google authentication', 'From LKR 5,000'], ['Admin dashboard', 'From LKR 15,000']
];

const enquiryFieldClass = 'w-full min-h-12 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-base text-white placeholder-gray-500 focus:border-nhubx-glow-primary/60 aria-[invalid=true]:border-red-400/70';

const Pricing = ({ ready }) => {
  const dialogRef = useRef(null);
  const countryChanged = useRef(false);
  const trackedPlan = useRef(null);
  const successHeading = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedPlan, setSelectedPlan] = useState(() => plans.find(({ name }) => name === searchParams.get('plan')) ?? null);
  const [form, setForm] = useState({ name: '', country: 'LK', whatsapp: '', email: '', details: '' });
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [fieldError, setFieldError] = useState(null);

  useEffect(() => { document.title = 'Pricing | NHubX'; }, []);

  useEffect(() => {
    if (status === 'success') successHeading.current?.focus();
  }, [status]);

  const countryOptions = useMemo(() => {
    const names = new Intl.DisplayNames([navigator.language || 'en'], { type: 'region' });
    return getCountries()
      .map((country) => ({ country, name: names.of(country) || country, dialCode: getCountryCallingCode(country) }))
      .sort((first, second) => first.name.localeCompare(second.name));
  }, []);

  useEffect(() => {
    const selectDetectedCountry = async () => {
      let detectedCountry = null;
      try {
        const response = await fetch('/api/country');
        if (response.ok) detectedCountry = (await response.json()).country;
      } catch {
        // Local development and non-Vercel hosting use the browser locale fallback.
      }

      if (!detectedCountry) {
        const localeParts = (navigator.language || '').split('-');
        detectedCountry = localeParts.length > 1 ? localeParts.at(-1).toUpperCase() : null;
      }

      if (!countryChanged.current && detectedCountry && getCountries().includes(detectedCountry)) {
        setForm((current) => ({ ...current, country: detectedCountry }));
      }
    };

    selectDetectedCountry();
  }, []);

  useEffect(() => {
    if (!ready || !selectedPlan) return undefined;

    const dialog = dialogRef.current;
    const opener = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    const viewport = window.visualViewport;
    const sizeDialog = () => {
      dialog.style.setProperty('--enquiry-viewport-height', viewport.height + 'px');
      dialog.style.setProperty('--enquiry-viewport-top', viewport.offsetTop + 'px');
    };

    document.body.style.overflow = 'hidden';
    dialog.showModal();
    if (trackedPlan.current !== selectedPlan) {
      trackPricingEvent('open');
      trackedPlan.current = selectedPlan;
    }
    if (viewport) {
      sizeDialog();
      viewport.addEventListener('resize', sizeDialog);
      viewport.addEventListener('scroll', sizeDialog);
    }

    return () => {
      viewport?.removeEventListener('resize', sizeDialog);
      viewport?.removeEventListener('scroll', sizeDialog);
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (opener instanceof HTMLElement) opener.focus({ preventScroll: true });
    };
  }, [ready, selectedPlan]);
  const openPlanForm = (plan) => {
    setSelectedPlan(plan);
    setStatus('idle');
    setError('');
    setFieldError(null);
  };

  const updateField = (event) => {
    const { name, value } = event.currentTarget;
    if (name === 'country' || name === 'whatsapp') countryChanged.current = true;
    setForm((current) => ({ ...current, [name]: value }));
    if (fieldError?.field === name || (name === 'country' && fieldError?.field === 'whatsapp')) setFieldError(null);
  };

  const fieldProps = (name) => ({
    name,
    value: form[name],
    onChange: updateField,
    'aria-invalid': fieldError?.field === name || undefined,
    'aria-describedby': fieldError?.field === name ? 'plan-enquiry-field-error' : undefined,
  });

  const fieldMessage = (name) => fieldError?.field === name && (
    <p id="plan-enquiry-field-error" role="alert" className="mt-1.5 text-sm text-red-300">{fieldError.error}</p>
  );

  const closePlanForm = () => {
    if (status === 'loading') return;
    trackedPlan.current = null;
    setSelectedPlan(null);
    if (searchParams.has('plan')) {
      const next = new URLSearchParams(searchParams);
      next.delete('plan');
      setSearchParams(next, { replace: true });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (status === 'loading') return;

    const enquiry = preparePlanEnquiry(selectedPlan, form);
    if (enquiry.error) {
      setFieldError(enquiry);
      setError('');
      const field = event.currentTarget.elements.namedItem(enquiry.field);
      const optionalGroup = field.closest('details');
      if (optionalGroup) optionalGroup.open = true;
      field.focus();
      return;
    }

    setFieldError(null);
    if (!navigator.onLine) {
      setError('You’re offline. Reconnect and try again. Your details are still here.');
      return;
    }
    setStatus('loading');
    setError('');
    try {
      await saveMessage(enquiry.name, enquiry.email, enquiry.message);
      setStatus('success');
      trackPricingEvent('submitted');
      setForm((current) => ({ name: '', country: current.country, whatsapp: '', email: '', details: '' }));
    } catch (submitError) {
      console.error('Unable to submit plan enquiry:', submitError);
      setError('Your enquiry could not be sent. Your details are still here. Please try again.');
      setStatus('error');
    }
  };

  return (
    <div className="site-container min-h-screen pb-20 pt-28 sm:pt-36">
      <div className="max-w-7xl mx-auto">
        <header className="mx-auto mb-12 max-w-3xl text-center">
          <h1 className="site-title mb-5">A website plan for every stage.</h1>
          <p className="text-lg leading-relaxed text-gray-300">Compare one-time development prices and annual hosting costs. Choose a plan and we’ll confirm the scope before work begins.</p>
        </header>

        <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-4 items-stretch">
          {plans.map((plan) => (
            <article key={plan.name} className={`relative flex flex-col rounded-2xl border p-5 ${plan.popular ? 'border-nhubx-glow-primary/50 bg-nhubx-glow-primary/[0.07]' : 'border-white/10 bg-white/[0.03]'}`}>
              {plan.popular && <span className="absolute -top-3 left-5 rounded-full bg-nhubx-glow-primary px-3 py-1 text-xs font-bold">Most popular</span>}
              <h2 className="text-xl font-bold">{plan.name}</h2>
              <p className="mt-3 text-sm leading-relaxed text-gray-300 xl:min-h-24">{plan.description}</p>
              <div className="my-5"><span className="text-xs text-gray-400">LKR</span><p className="text-3xl font-bold tabular-nums text-white">{plan.price}</p><p className="text-sm text-gray-300">One-time development</p></div>
              <ul className="flex-1 space-y-2.5">{plan.features.map((feature) => <li key={feature} className="flex items-start gap-2 text-sm text-gray-300"><Check size={15} aria-hidden="true" className="mt-0.5 shrink-0 text-nhubx-glow-primary" />{feature}</li>)}</ul>
              <div className="mt-6 border-t border-white/10 pt-4"><p className="text-sm text-gray-400">Annual hosting</p><p className="mt-1 text-sm font-semibold">{plan.hosting}</p></div>
              <button type="button" onClick={() => openPlanForm(plan)} className={`site-action mt-5 ${plan.popular ? 'bg-nhubx-glow-primary hover:bg-nhubx-glow-hover' : 'bg-white/[0.07] hover:bg-white/[0.12]'}`}>Choose plan</button>
              <WhatsAppEnquiry planName={plan.name} source="pricing" className="mt-2 flex min-h-11 items-center justify-center gap-2 rounded-lg text-sm text-gray-300 hover:bg-white/5 hover:text-white" />
            </article>
          ))}
        </div>

        <PricingExamples />

        <section className="mt-20 grid lg:grid-cols-2 gap-8">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8"><h2 className="text-2xl font-bold mb-2">Optional add-ons</h2><p className="text-sm text-gray-500 mb-6">Add only what your project needs.</p><div className="divide-y divide-white/[0.06]">{addons.map(([name, price]) => <div key={name} className="flex items-center justify-between gap-4 py-3 text-sm"><span className="text-gray-400">{name}</span><span className="font-semibold text-white text-right">{price}</span></div>)}</div></div>

          <div className="space-y-5">
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8"><Database className="text-nhubx-glow-primary mb-4" /><h2 className="text-xl font-bold mb-3">Database and provider costs</h2><p className="text-sm leading-relaxed text-gray-500">Development prices cover database setup and integration only. Firebase, storage, bandwidth, authentication, cloud functions, paid APIs and other provider usage are paid directly by the customer.</p></div>
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8"><Server className="text-nhubx-glow-primary mb-4" /><h2 className="text-xl font-bold mb-3">Hosting and domains</h2><p className="text-sm leading-relaxed text-gray-500">Hosting is renewed annually and is not free with any plan. Domain registration is charged separately at the registrar’s current price. High-traffic or backend-heavy projects may need custom hosting.</p></div>
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8"><Globe2 className="text-nhubx-glow-primary mb-4" /><h2 className="text-xl font-bold mb-3">Payment terms</h2><p className="text-sm leading-relaxed text-gray-500">40% to begin, 30% after design approval and 30% before launch. Work outside the approved scope is quoted separately.</p></div>
          </div>
        </section>

        <PricingGuide plans={plans} />

        <section className="mt-16 rounded-2xl border border-nhubx-glow-primary/20 bg-nhubx-glow-primary/[0.06] p-8 sm:p-12 text-center"><h2 className="text-3xl sm:text-4xl font-black">Need something more specific?</h2><p className="mt-3 text-gray-500">E-commerce, booking systems, AI tools and custom platforms are quoted according to scope.</p><Link to="/contact" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-nhubx-glow-primary px-6 py-3 text-xs font-bold uppercase tracking-wider">Request a quote <ChevronRight size={15} /></Link></section>
      </div>

      {selectedPlan && (
        <dialog
          ref={dialogRef}
          aria-labelledby="plan-form-title"
          className="pricing-dialog fixed inset-x-0 bottom-auto m-0 h-full w-full max-w-none bg-transparent text-white open:flex items-end sm:items-center justify-center p-0 sm:p-6"
          onClick={(event) => { if (event.target === event.currentTarget) closePlanForm(); }}
          onCancel={(event) => { event.preventDefault(); closePlanForm(); }}
        >
          <div className="relative w-full max-w-xl max-h-[94%] sm:max-h-[90%] overflow-y-auto overscroll-contain rounded-t-3xl sm:rounded-2xl border border-white/10 bg-[#0b0b0b] px-5 py-6 sm:p-8 shadow-2xl [padding-bottom:max(1.5rem,env(safe-area-inset-bottom))]">
            <div className="sm:hidden w-10 h-1 rounded-full bg-white/15 mx-auto mb-5" />
            <div className="flex items-start justify-between gap-3 mb-6 sm:mb-7">
              <div className="min-w-0"><p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-nhubx-glow-primary mb-2">Plan enquiry</p><h2 id="plan-form-title" className="text-2xl sm:text-3xl font-black truncate">{selectedPlan.name}</h2><p className="text-xs sm:text-sm text-gray-500 mt-1">LKR {selectedPlan.price} one-time development · {selectedPlan.hosting} hosting</p></div>
              <button onClick={closePlanForm} disabled={status === 'loading'} aria-label="Close" className="shrink-0 min-w-11 min-h-11 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white disabled:opacity-50"><X size={19} /></button>
            </div>

            {status === 'success' ? (
              <div className="py-8 text-center">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-green-500/20 bg-green-500/10"><Check aria-hidden="true" className="text-green-400" /></div>
                <h3 ref={successHeading} tabIndex={-1} className="text-2xl font-bold">Enquiry received</h3>
                <p className="mx-auto mt-3 max-w-sm text-gray-400">We’ll review your {selectedPlan.name} enquiry and reply by email. We’ll confirm what you need before sending a quote with the scope, price, and estimated timeline.</p>
                <button type="button" onClick={closePlanForm} className="mt-7 rounded-xl bg-white/10 px-6 py-3 text-sm font-semibold hover:bg-white/15">Back to pricing</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate aria-describedby="plan-enquiry-help" aria-busy={status === 'loading'} className="space-y-4">
                <p id="plan-enquiry-help" className="text-sm text-gray-400">Your name and email are all we need to get started.</p>
                <fieldset disabled={status === 'loading'} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="plan-enquiry-name" className="mb-1.5 block text-sm font-semibold">Your name</label>
                      <input {...fieldProps('name')} id="plan-enquiry-name" required maxLength={80} autoComplete="name" placeholder="Enter your name" className={enquiryFieldClass} />
                      {fieldMessage('name')}
                    </div>
                    <div>
                      <label htmlFor="plan-enquiry-email" className="mb-1.5 block text-sm font-semibold">Email address</label>
                      <input {...fieldProps('email')} id="plan-enquiry-email" required type="email" maxLength={120} autoComplete="email" placeholder="you@example.com" className={enquiryFieldClass} />
                      {fieldMessage('email')}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="plan-enquiry-details" className="mb-1.5 block text-sm font-semibold">Project details <span className="font-normal text-gray-400">(optional)</span></label>
                    <textarea {...fieldProps('details')} id="plan-enquiry-details" rows={3} maxLength={1000} placeholder="For example, a website for my shop with a product gallery" className={enquiryFieldClass + ' resize-y'} />
                  </div>

                  <details className="rounded-xl border border-white/10 px-3.5 py-2.5">
                    <summary className="cursor-pointer text-sm font-semibold">Add a WhatsApp number <span className="font-normal text-gray-400">(optional)</span></summary>
                    <div className="mt-3 grid gap-3 min-[420px]:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                      <div>
                        <label htmlFor="plan-enquiry-country" className="mb-1.5 block text-sm text-gray-300">Country calling code</label>
                        <select {...fieldProps('country')} id="plan-enquiry-country" autoComplete="tel-country-code" className={enquiryFieldClass + ' bg-[#101010] [&>option]:bg-[#101010]'}>
                          {countryOptions.map(({ country, name, dialCode }) => <option key={country} value={country}>{name} (+{dialCode})</option>)}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="plan-enquiry-phone" className="mb-1.5 block text-sm text-gray-300">WhatsApp number</label>
                        <input {...fieldProps('whatsapp')} id="plan-enquiry-phone" type="tel" inputMode="tel" maxLength={24} autoComplete="tel-national" placeholder="77 123 4567" className={enquiryFieldClass} />
                        {fieldMessage('whatsapp')}
                      </div>
                    </div>
                  </details>
                </fieldset>

                {error && <p role="alert" className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}
                <p className="text-xs leading-relaxed text-gray-400">We’ll use your details to reply about this quote.</p>
                <button type="submit" disabled={status === 'loading'} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-nhubx-glow-primary px-4 py-3 text-sm font-bold hover:bg-nhubx-glow-hover disabled:opacity-60">
                  {status === 'loading' ? <><Loader2 size={16} aria-hidden="true" className="motion-safe:animate-spin" /> Sending enquiry…</> : <><Send size={16} aria-hidden="true" /> Send enquiry</>}
                </button>
                <WhatsAppEnquiry planName={selectedPlan.name} source="pricing" className="flex min-h-11 items-center justify-center gap-2 rounded-lg border border-white/10 text-sm font-semibold hover:bg-white/5" />
              </form>
            )}
          </div>
        </dialog>
      )}
    </div>
  );
};

export default Pricing;
