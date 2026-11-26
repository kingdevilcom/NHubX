import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import WhatsAppEnquiry from '../components/WhatsAppEnquiry';
import { caseStudies } from '../projectCaseStudies';
import { entryPlan } from '../salesOffer';

const included = [
  'A responsive page for your services, business details, and contact information',
  'Clear WhatsApp and contact links so customers can reach you',
  'Basic on-page SEO and one revision',
];
const example = caseStudies.find(({ id }) => id === 'nextpath');

export default function ServiceBusinessWebsites() {
  useEffect(() => { document.title = 'Websites for Service Businesses in Sri Lanka | NHubX'; }, []);

  return (
    <div className="min-h-screen px-5 pb-20 pt-32 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <h1 className="text-4xl font-black tracking-tight sm:text-6xl">Websites for Sri Lankan service businesses</h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-gray-300">Give clients one place to learn about your services and ask for a quote. For consultancies, training providers, and local service teams.</p>
          <p className="mt-4 text-gray-400"><strong className="text-xl text-nhubx-glow-primary">From LKR {entryPlan.price}</strong> for a one-page site. Mini hosting is LKR 499/year. Domains are billed separately.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to={'/pricing?plan=' + encodeURIComponent(entryPlan.name)} className="inline-flex min-h-12 items-center rounded-xl bg-nhubx-glow-primary px-5 font-semibold hover:bg-nhubx-glow-hover">Get a quote</Link>
            <WhatsAppEnquiry planName={entryPlan.name} source="service-page" className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-white/10 px-5 font-semibold hover:bg-white/5" />
          </div>
        </header>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          <section className="glass rounded-2xl p-6" aria-labelledby="mini-includes">
            <h2 id="mini-includes" className="text-2xl font-bold">What Mini includes</h2>
            <ul className="mt-4 space-y-4">
              {included.map((item) => (
                <li key={item} className="flex gap-2.5 text-gray-300"><Check size={17} aria-hidden="true" className="mt-1 shrink-0 text-nhubx-glow-primary" />{item}</li>
              ))}
            </ul>
            <Link to="/pricing" className="mt-5 inline-block text-sm font-semibold text-nhubx-glow-primary hover:underline">Compare all plans</Link>
          </section>
          <article className="glass-card overflow-hidden">
            <img src={example.image} alt={example.alt} width="1280" height="800" loading="lazy" decoding="async" className="aspect-video w-full object-cover object-top" />
            <div className="p-6">
              <h2 className="text-2xl font-bold">{example.name}</h2>
              <p className="mt-2 text-gray-300">A Sri Lankan consultancy site that presents its services and gives business owners a way to request a consultation.</p>
              <a href={example.demo} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-sm font-semibold text-nhubx-glow-primary hover:underline">View NextPath live demo</a>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
