import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomeView from './views/HomeView';
import AboutView from './views/AboutView';
import MoodboardsView from './views/MoodboardsView';
import CreateView from './views/CreateView';
import BackgroundFluid from './components/BackgroundFluid';
import DominoFlash from './components/DominoFlash';

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [history, setHistory] = useState([]);
  const [editDraft, setEditDraft] = useState(null);
  const [theme, setTheme] = useState('dark');
  const [isFlashing, setIsFlashing] = useState(false);

  const toggleTheme = () => {
    // When dark, we are switching TO light
    const targetTheme = theme === 'dark' ? 'light' : 'dark';
    setIsFlashing(true);
    
    setTimeout(() => {
      setTheme(targetTheme);
    }, 400); // Swap the DOM theme halfway through the domino sweep

    setTimeout(() => setIsFlashing(false), 900); // End the flash once the domino wave clears
  };

  useEffect(() => {
    document.body.dataset.theme = theme;
  }, [theme]);

  const handleSaveToHistory = (newGrid) => {
    setHistory(prev => [newGrid, ...prev]);
  };

  const handleLoadDraft = (draft) => {
    setEditDraft(draft);
    setCurrentView('create');
  };

  // Reset the draft when navigating away from create
  useEffect(() => {
    if (currentView !== 'create') {
      setEditDraft(null);
    }
  }, [currentView]);

  return (
    <>
      <BackgroundFluid />
      <Navbar currentView={currentView} setCurrentView={setCurrentView} theme={theme} toggleTheme={toggleTheme} />
      
      {/* Cinematic Domino Pixel Repowering Overlay */}
      <DominoFlash isFlashing={isFlashing} theme={theme} />

      <main>
        {currentView === 'home' && (
          <HomeView 
            onGoToCreate={() => setCurrentView('create')} 
            onGoToAbout={() => setCurrentView('about')} 
          />
        )}
        
        {currentView === 'about' && (
          <AboutView />
        )}
        
        {currentView === 'moodboards' && (
          <MoodboardsView 
            history={history} 
            onGoToCreate={() => setCurrentView('create')}
            onLoadDraft={handleLoadDraft}
          />
        )}
        
        {currentView === 'create' && (
          <CreateView 
            onSaveSuccess={handleSaveToHistory} 
            initialDraft={editDraft}
          />
        )}
      </main>
    </>
  );
}
