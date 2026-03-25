import React from 'react';
import './Features.css';

const features = [
  {
    title: "Secure Infrastructure",
    description: "Built with military-grade encryption to protect your data and projects.",
    icon: "🛡️"
  },
  {
    title: "Real-time Monitoring",
    description: "Stay ahead with sub-second latency and instant status updates.",
    icon: "⚡"
  },
  {
    title: "Decentralized Power",
    description: "Leverage the power of distributed systems for ultimate reliability.",
    icon: "🌐"
  }
];

const Features = () => {
  return (
    <section id="features" className="features container">
      <h2 className="section-title">Why <span className="glow-cyan">NHubX?</span></h2>
      <div className="features-grid">
        {features.map((f, i) => (
          <div key={i} className="feature-card glass">
            <div className="feature-icon">{f.icon}</div>
            <h3 className="feature-title">{f.title}</h3>
            <p className="feature-desc">{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
