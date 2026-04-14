import React from 'react';

export default function AboutView() {
  return (
    <div className="view-container">
      <h1 className="hero-text font-sans" style={{ fontSize: '3.5rem', marginTop: '2rem' }}>About</h1>

      <div style={{ marginTop: '3rem', maxWidth: '800px' }}>
        <h2 className="font-sans" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>What is AuraGen?</h2>

        <p className="font-mono" style={{ color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '1.5rem' }}>
          AuraGen is a tool that explores the dynamics of transforming natural language into Generative AI-powered highly structured, visually cohesive layouts.
        </p>

        <p className="font-mono" style={{ color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '1.5rem' }}>
          By generating custom grid compositions and extracting color palettes, the tool allows designers to incorporate branding elements systematically. We leverage LLM prompt-engineering to intelligently slice a user's abstract input into concise asset generations perfect for <a style={{ color: 'white' }}>Stable Diffusion</a>.
        </p>

        <h2 className="font-sans" style={{ fontSize: '1.5rem', marginTop: '3rem', marginBottom: '1.5rem' }}>How it works?</h2>

        <p className="font-mono" style={{ color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '1.5rem' }}>
          The primary input is centered around the core aesthetic—defining the mood or vibe using a simple sentence. Users then specify the exact number of assets and choose an aspect ratio and a structural grid permutation. Our extensive CSS grid engine reconstructs pure HTML/CSS representations of complex editorial layouts dynamically.
        </p>

      </div>
    </div>
  );
}
