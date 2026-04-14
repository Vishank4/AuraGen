import React from 'react';
import { Lightbulb } from 'lucide-react';
import ShatterText from './ShatterText';

export default function Navbar({ currentView, setCurrentView, theme, toggleTheme }) {
  const NavLink = ({ view, label }) => (
    <button 
      className="nav-link-btn" 
      onClick={() => setCurrentView(view)}
      style={{
        textDecoration: currentView === view ? 'underline' : 'none',
        textUnderlineOffset: '4px'
      }}
    >
      <span className="nav-link-text" data-text={label}>{label}</span>
    </button>
  );

  return (
    <nav className="navbar">
      <div 
        onClick={() => setCurrentView('home')}
        style={{ textDecoration: 'none', color: 'var(--text-primary)' }}
      >
        <ShatterText text="AuraGen Creative" baseClassName="brand-logo" />
      </div>
      <div className="nav-links">
        <NavLink view="about" label="About" />
        <NavLink view="moodboards" label="Moodboards" />
        <button 
          className="create-btn"
          onClick={() => setCurrentView('create')}
        >
          Create
        </button>
        <button 
          className="bulb-glow"
          onClick={toggleTheme} 
          style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          aria-label="Toggle Theme"
        >
          <Lightbulb size={20} fill={theme === 'light' ? 'currentColor' : 'none'} />
        </button>
      </div>
    </nav>
  );
}
