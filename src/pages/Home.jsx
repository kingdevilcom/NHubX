import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Check, Flame } from 'lucide-react';
import { useContent } from '../context/ContentContext';

const benefits = ['Custom design', 'Responsive build', 'Clear pricing'];

export default function Home() {
  const { content } = useContent();
  useEffect(() => { document.title = 'NHubX | Modern Digital Solutions'; }, []);

  return (
    <div className="home-layout site-width">
      <section className="home-hero" aria-labelledby="home-title">
        <div>
          <p className="home-kicker">Websites · Applications · Digital systems</p>
          <h1 id="home-title">{content.heroTitle}</h1>
          <p className="home-subtitle">{content.heroSubtitle}</p>
          <p className="home-description">Affordable custom websites and connected digital products for individuals and businesses in Sri Lanka.</p>
          <div className="home-actions">
            <Link to="/pricing" className="home-button home-button-primary">View pricing</Link>
            <Link to="/projects" className="home-button">Explore projects</Link>
          </div>
        </div>
        <div className="home-art">
          <Flame aria-hidden="true" strokeWidth={1.15} />
        </div>
      </section>
      <div className="home-summary">
        <ul>
          {benefits.map((benefit) => (
            <li key={benefit}><Check size={16} aria-hidden="true" />{benefit}</li>
          ))}
        </ul>
        <p>One-page websites from <strong>LKR 4,999</strong></p>
      </div>
    </div>
  );
}
