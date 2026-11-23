import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import WhatsAppEnquiry from '../components/WhatsAppEnquiry';
import { useContent } from '../context/ContentContext';
import { caseStudies } from '../projectCaseStudies';
import { entryPlan } from '../salesOffer';

const featured = caseStudies[0];
const actionClass = 'w-full min-h-12 sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors';

export default function Home() {
  const { content } = useContent();
  useEffect(() => { document.title = 'NHubX | Websites for Sri Lankan Small Businesses'; }, []);

  return (
    <div className="relative min-h-screen flex items-center px-4 sm:px-6 pt-28 pb-20 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_40%,rgb(var(--fire-primary)/0.07),transparent_45%)]" />
      <div className="relative max-w-5xl mx-auto w-full text-center">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-nhubx-glow-primary mb-5">{content.heroTitle} · {content.heroSubtitle}</p>
        <h1 className="mx-auto max-w-4xl text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.06] text-white">
          Custom websites for Sri Lankan small businesses
        </h1>
        <p className="mt-5 text-lg text-gray-300">
          One-page websites from <strong className="text-nhubx-glow-primary">LKR {entryPlan.price}</strong>. Hosting is billed separately.
        </p>

        <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to={'/pricing?plan=' + encodeURIComponent(entryPlan.name)} className={actionClass + ' bg-nhubx-glow-primary hover:bg-nhubx-glow-hover shadow-glow'}>Get a quote</Link>
          <WhatsAppEnquiry planName={entryPlan.name} source="home" className={actionClass + ' border border-white/10 bg-white/[0.02] hover:bg-white/[0.07]'} />
        </div>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-gray-400">
          {['Custom design', 'Mobile-friendly', 'Clear pricing'].map((item) => <span key={item} className="inline-flex items-center gap-2"><Check size={14} aria-hidden="true" className="text-nhubx-glow-primary" />{item}</span>)}
        </div>

        <article className="glass mx-auto mt-9 flex max-w-xl flex-col items-center gap-4 rounded-xl p-4 text-center sm:flex-row sm:text-left">
          <img src={featured.image} alt={featured.alt} width="1280" height="800" className="aspect-video w-40 shrink-0 rounded-lg object-cover object-top" />
          <div>
            <h2 className="text-base font-bold">{featured.name}</h2>
            <p className="mt-1 text-sm text-gray-400">A real consultancy website with a consultation enquiry flow.</p>
            <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm font-semibold sm:justify-start">
              <a href={featured.demo} target="_blank" rel="noopener noreferrer" className="text-nhubx-glow-primary hover:underline" aria-label={'Open ' + featured.name + ' live demo (new tab)'}>Live demo</a>
              <Link to="/projects" className="text-gray-300 hover:text-white hover:underline">More projects</Link>
            </div>
          </div>
        </article>
        <Link to="/websites-for-service-businesses" className="mt-4 inline-block text-sm font-semibold text-gray-300 hover:text-white hover:underline">Websites for service businesses</Link>
      </div>
    </div>
  );
}
