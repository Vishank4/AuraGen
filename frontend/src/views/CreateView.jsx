import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { Settings2 } from 'lucide-react';

// Removed generateMockAssets as we now use the real backend pipeline
// function generateMockAssets(prompt, count) { ... }

export default function CreateView({ onSaveSuccess, initialDraft }) {
  const [prompt, setPrompt] = useState(initialDraft?.prompt || '');
  const [imageCount, setImageCount] = useState(initialDraft?.imageCount || 4);
  const [aspectRatio, setAspectRatio] = useState(initialDraft?.aspectRatio || '1-1');
  const [selectedLayout, setSelectedLayout] = useState(initialDraft?.layout || 'grid');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeGrid, setActiveGrid] = useState(initialDraft || null);
  const [engine, setEngine] = useState('cinematic');
  const [error, setError] = useState(null);

  const gridRef = useRef(null);

  const engineThemes = {
    cinematic: { color: '#F7C940', label: 'Cinematic', contrast: '#000000', theme: 'dark' },
    photoreal: { color: '#FEFADD', label: 'Photoreal', contrast: '#000000', theme: 'dark' },
    digital_art: { color: '#C86F4B', label: 'Digital Art', contrast: '#000000', theme: 'dark' },
    minimalist: { color: '#CCF851', label: 'Minimalist', contrast: '#000000', theme: 'dark' },
  };

  const currentTheme = engineThemes[engine];

  // Re-sync if initialDraft changes
  React.useEffect(() => {
    if (initialDraft) {
      setPrompt(initialDraft.prompt);
      setImageCount(initialDraft.imageCount);
      setAspectRatio(initialDraft.aspectRatio);
      setSelectedLayout(initialDraft.layout);
      setActiveGrid(initialDraft);
    } else {
      setActiveGrid(null);
    }
  }, [initialDraft]);

  const aspectOptions = [
    { id: '1-1', name: '1:1 Square' },
    { id: '4-3', name: '4:3 Standard' },
    { id: '16-9', name: '16:9 Wide' },
    { id: '3-4', name: '3:4 Vertical' },
    { id: '9-16', name: '9:16 Portrait' }
  ];

  const layoutOptions = {
    2: ['split-h', 'split-v', 'hero-l', 'hero-r'],
    3: ['row', 'col', 'hero-l', 'hero-r', 'hero-t', 'hero-b'],
    4: ['grid', 'row', 'hero-l', 'hero-r', 'hero-t'],
    5: ['bento', 'strip', 'hero-center'],
    6: ['grid', 'uneven', 'complex']
  };

  const activeLayouts = layoutOptions[imageCount];

  React.useEffect(() => {
    if (!activeLayouts.includes(selectedLayout)) {
      setSelectedLayout(activeLayouts[0]);
    }
  }, [imageCount, activeLayouts, selectedLayout]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    try {
      const response = await fetch(`${apiBaseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          count: imageCount,
          layout: selectedLayout,
          aspect_ratio: aspectRatio,
          engine,
          guidance: 7.5, // Fallback to safe defaults
          steps: 30
        })
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.images || data.images.length === 0) {
        setError("AI Engines are currently overwhelmed or loading. Please try a different engine or click generate again.");
        setActiveGrid(null);
        return;
      }

      const newGrid = {
        prompt: data.prompt,
        images: data.images,
        layout: data.layout,
        imageCount: data.imageCount,
        aspectRatio: data.aspectRatio,
        reasoning: data.reasoning
      };
      
      setActiveGrid(newGrid);
      onSaveSuccess(newGrid);
    } catch (error) {
      console.error("Generation failed:", error);
      setError("Failed to connect to the backend server. The AI core might be warming up.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!gridRef.current) return;
    try {
      const canvas = await html2canvas(gridRef.current, {
        useCORS: true,
        backgroundColor: '#121212',
        scale: 2
      });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `auragen-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="view-container" style={{ paddingTop: '2rem' }}>
      <div className="studio-layout">
        
        {/* Control Deck */}
        <div className="studio-sidebar">
          <div 
            className="control-deck" 
            style={{ 
              '--theme-color': currentTheme.color,
              '--theme-contrast': currentTheme.contrast
            }}
            data-contrast={currentTheme.theme}
          >
            <div className="deck-header">
              <Settings2 size={18} />
              <span>Engine Parameters</span>
            </div>

            <div className="form-group">
              <div className="engine-selector grid grid-cols-2 gap-2">
                {Object.entries(engineThemes).map(([key, value]) => (
                  <button
                    key={key}
                    className={`btn-engine ${engine === key ? 'active' : ''}`}
                    onClick={() => setEngine(key)}
                  >
                    {value.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="brutalist-divider" />

            <div className="form-group">
              <label className="form-label" style={{ color: 'inherit' }}>Aesthetic Core</label>
              <textarea
                className="form-input"
                rows={2}
                placeholder="Describe your vision..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={isGenerating}
              />
            </div>

            <div className="brutalist-divider" />

            <div className="form-group">
              <label className="form-label flex justify-between" style={{ color: 'inherit' }}>
                Asset Count <span>{imageCount}</span>
              </label>
              <input
                type="range"
                min="2"
                max="6"
                step="1"
                value={imageCount}
                onChange={(e) => setImageCount(parseInt(e.target.value))}
                disabled={isGenerating}
                className="slider-brutalist"
              />
            </div>

            <div className="brutalist-divider" />

            <div className="form-group">
              <label className="form-label" style={{ color: 'inherit' }}>Aspect Ratio</label>
              <div className="aspect-selector">
                {aspectOptions.map(opt => (
                  <button
                    key={opt.id}
                    className={`btn-grid-option ${aspectRatio === opt.id ? 'active' : ''}`}
                    onClick={() => setAspectRatio(opt.id)}
                  >
                    {opt.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ color: 'inherit' }}>Structural Grid</label>
              <div className="grid-flex-wrap">
                {activeLayouts.map(layout => (
                  <button
                    key={layout}
                    className={`btn-grid-option ${selectedLayout === layout ? 'active' : ''}`}
                    onClick={() => setSelectedLayout(layout)}
                  >
                    {layout.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div className="brutalist-divider" style={{ opacity: 0.8 }} />

            <button
              className="btn-solid"
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              style={{ 
                width: '100%',
                background: currentTheme.contrast === '#000000' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)',
                borderWidth: '2px'
              }}
            >
              {isGenerating ? 'Processing...' : 'Generate Lab Board'}
            </button>
          </div>
        </div>

        {/* Main Canvas */}
        <div className="studio-canvas">
          {activeGrid ? (
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div 
                ref={gridRef}
                className={`aspect-${activeGrid.aspectRatio}`}
              >
                <div 
                  className={`mood-grid layout-${activeGrid.imageCount}-${activeGrid.layout}`}
                  style={{ width: '100%', height: '100%' }}
                >
                  {activeGrid.images.map((src, idx) => (
                    <div key={idx} className="image-container">
                      <img src={src} className="grid-image" crossOrigin="anonymous" alt={`asset ${idx}`}/>
                    </div>
                  ))}
                </div>
              </div>
              <button className="btn-outline" onClick={handleDownload} style={{ marginTop: '2rem' }}>
                Download PNG
              </button>
            </div>
          ) : error ? (
            <div className="text-center p-8 bg-black/20 rounded border border-white/5 max-w-md">
              <div className="text-xl mb-2" style={{ color: currentTheme.color }}>Engine Delay Detected</div>
              <div className="font-mono text-sm opacity-60 mb-4">{error}</div>
              <button className="btn-outline text-xs" onClick={handleGenerate}>Try Again</button>
            </div>
          ) : (
            <div className="font-mono text-secondary" style={{ color: 'var(--text-secondary)' }}>
              Fill out the parameters and click Generate.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
