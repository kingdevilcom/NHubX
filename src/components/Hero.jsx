import React from 'react';
import './Hero.css';

const Hero = () => {
  return (
    <section id="home" className="hero">
      <div className="hero-content container">
        <h1 className="hero-title">Experience the <span className="gradient-text">Future</span> of NHubX</h1>
        <p className="hero-subtitle">Innovative solutions for modern developers. Secure, scalable, and decentralized.</p>
        <div className="hero-btns">
          <button className="btn-primary">Explore Platform</button>
          <button className="btn-secondary glass">Learn More</button>
        </div>
      </div>
      <div className="hero-glow"></div>
    </section>
  );
};

export default Hero;
