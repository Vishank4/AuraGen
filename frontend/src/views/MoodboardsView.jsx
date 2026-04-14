import React from 'react';
import { Eye } from 'lucide-react';

// Added functional payloads for the examples so loading them in CreateView works
const examples = [
  { id: 1, title: 'vintage clothing store', prompt: 'vintage clothing store', tags: 'retro, fashion, nostalgia, uni...', colors: ['#D97736', '#3D4A3E', '#F2E8CF'], imageCount: 4, aspectRatio: '16-9', layout: 'hero-l', images: ['https://picsum.photos/seed/vintage1/800/800','https://picsum.photos/seed/vintage2/800/800','https://picsum.photos/seed/vintage3/800/800','https://picsum.photos/seed/vintage4/800/800'] },
  { id: 2, title: 'basketball team', prompt: 'intense basketball team brand portrait', tags: 'local, semi pro, youth, streng...', colors: ['#BC3821', '#1f2937', '#f3f4f6'], imageCount: 3, aspectRatio: '1-1', layout: 'hero-t', images: ['https://picsum.photos/seed/bball1/800/800','https://picsum.photos/seed/bball2/800/800','https://picsum.photos/seed/bball3/800/800'] },
  { id: 3, title: 'environmental nonprofit', prompt: 'lush environmental nonprofit', tags: 'conservation, sustainability, ...', colors: ['#4ade80', '#166534', '#bbf7d0'], imageCount: 5, aspectRatio: '3-4', layout: 'bento', images: ['https://picsum.photos/seed/env1/800/800','https://picsum.photos/seed/env2/800/800','https://picsum.photos/seed/env3/800/800','https://picsum.photos/seed/env4/800/800','https://picsum.photos/seed/env5/800/800'] }
];

export default function MoodboardsView({ history, onGoToCreate, onLoadDraft }) {
  return (
    <div className="view-container">
      <h1 className="hero-text font-sans" style={{ fontSize: '3.5rem', margin: '2rem 0' }}>Moodboards</h1>
      
      <div style={{ marginTop: '3rem' }}>
        <h2 className="font-sans" style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Examples</h2>
        <div className="gallery-grid">
          {examples.map(ex => (
            <div key={ex.id} className="gallery-card">
              <div className="card-title">{ex.title}</div>
              <div className="card-tags">{ex.tags}</div>
              
              <div className="card-hover-overlay">
                {ex.colors.map((color, i) => (
                  <div key={i} className="color-dot" style={{ backgroundColor: color }} />
                ))}
                <button className="eye-btn" onClick={() => onLoadDraft(ex)}><Eye size={18} style={{ marginLeft: 'auto' }} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '4rem' }}>
        <h2 className="font-sans" style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Your work</h2>
        {history && history.length > 0 ? (
          <div className="gallery-grid">
            {history.map((item, index) => (
              <div key={index} className="gallery-card">
                <div className="card-title">{item.prompt}</div>
                <div className="card-tags">{item.imageCount} assets • {item.layout} • {item.aspectRatio}</div>
                
                <div className="card-hover-overlay">
                  <div className="color-dot" style={{ backgroundColor: '#fff' }} />
                  <div className="color-dot" style={{ backgroundColor: '#666' }} />
                  <button className="eye-btn" onClick={() => onLoadDraft(item)}><Eye size={18} style={{ marginLeft: 'auto' }} /></button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="font-mono" style={{ color: 'var(--text-secondary)' }}>
            Moodboards you create will appear here. <button onClick={onGoToCreate} style={{background: 'none', border: 'none', color: 'white', textDecoration: 'underline', cursor: 'pointer', fontFamily: 'Space Mono'}}>Create one now</button>.
          </p>
        )}
      </div>
    </div>
  );
}
