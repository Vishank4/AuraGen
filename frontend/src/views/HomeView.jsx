import React from 'react';

export default function HomeView({ onGoToCreate, onGoToAbout }) {
  return (
    <div className="view-container">
      <h1 className="hero-text font-sans">
        The AI tool to <br />
        kick-off your next <br />
        <span className="hero-highlight">branding project</span>
      </h1>
      
      <p className="hero-subtitle">
        AuraGen helps designers ditch the blank page and spark their creativity by generating stunning structural moodboards from simple aesthetic inputs and structured layout selections.
      </p>

      <div className="hero-actions">
        <button className="btn-outline" onClick={onGoToAbout}>
          Learn more
        </button>
        <button className="btn-solid btn-golden-flash" onClick={onGoToCreate}>
          Get Started
        </button>
      </div>
    </div>
  );
}
