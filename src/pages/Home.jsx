import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import WhatsAppEnquiry from '../components/WhatsAppEnquiry';
import HomeReviews from '../components/HomeReviews';
import { useContent } from '../context/ContentContext';
import { caseStudies } from '../projectCaseStudies';
import { entryPlan } from '../salesOffer';

const featured = caseStudies[0];
const paths = [
  ['/pricing', 'Compare website plans', 'See what each plan includes and what hosting costs.'],
  ['/websites-for-service-businesses', 'Websites for service businesses', 'See how customers can find your services and contact you.'],
  ['/orders', 'Manage your project', 'Open your quote, check delivery progress, and find invoices.'],
];

export default function Home() {
  const { content } = useContent();
  useEffect(() => { document.title = 'NHubX | Websites for Sri Lankan Small Businesses'; }, []);

  return (
    <div className="site-container pb-10 pt-28 sm:pt-36">
      <section aria-labelledby="home-title" className="grid items-center gap-10 pb-12 lg:grid-cols-[1fr_0.9fr] lg:gap-14 lg:pb-16">
        <div>
          <p className="site-kicker">{content.heroTitle} · {content.heroSubtitle}</p>
          <h1 id="home-title" className="site-title mt-4 max-w-[14ch]">Custom websites for Sri Lankan small businesses</h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-gray-300">One-page websites from <strong className="text-nhubx-glow-primary">LKR {entryPlan.price}</strong>. Hosting is billed separately.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to={'/pricing?plan=' + encodeURIComponent(entryPlan.name)} className="site-action bg-nhubx-glow-primary hover:bg-nhubx-glow-hover">Get a quote</Link>
            <WhatsAppEnquiry planName={entryPlan.name} source="home" className="site-action border border-white/15 bg-white/[0.04] hover:bg-white/10" />
          </div>
          <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-300">
            {['Custom design', 'Mobile-friendly', 'Clear pricing'].map((item) => <li key={item} className="inline-flex items-center gap-2"><Check size={15} aria-hidden="true" className="text-nhubx-glow-primary" />{item}</li>)}
          </ul>
        </div>
        <article className="site-feature overflow-hidden rounded-3xl border border-white/15">
          <div className="p-3 sm:p-4">
            <img src={featured.image} alt={featured.alt} width="1280" height="800" fetchPriority="high" className="aspect-[16/10] w-full rounded-xl object-cover object-top" />
          </div>
          <div className="border-t border-white/10 px-5 pb-5 pt-4 sm:px-6">
            <p className="site-kicker">Featured project</p>
            <h2 className="mt-1 text-2xl font-bold">{featured.name}</h2>
            <p className="mt-1 text-gray-300">A consultancy website with a consultation enquiry flow.</p>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
              <a href={featured.demo} target="_blank" rel="noopener noreferrer" className="text-nhubx-glow-primary hover:underline" aria-label={'Open ' + featured.name + ' live demo (new tab)'}>Live demo</a>
              <Link to="/projects" className="text-gray-300 hover:text-white hover:underline">More projects</Link>
            </div>
          </div>
        </article>
      </section>
      <nav aria-label="Explore NHubX" className="grid overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] sm:grid-cols-3">
        {paths.map(([path, title, description]) => (
          <Link key={path} to={path} className="site-path border-white/10 px-5 py-5 transition-colors hover:bg-white/[0.05] sm:px-6">
            <span className="block font-semibold text-white">{title}</span>
            <span className="mt-1 block text-sm leading-relaxed text-gray-300">{description}</span>
          </Link>
        ))}
      </nav>
      <HomeReviews />
    </div>
  );
}
