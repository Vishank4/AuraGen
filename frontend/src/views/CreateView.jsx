import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';

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
  const [guidanceScale, setGuidanceScale] = useState(7.5);
  const [inferenceSteps, setInferenceSteps] = useState(30);
  const [reasoning, setReasoning] = useState('');
  const [error, setError] = useState(null);

  const gridRef = useRef(null);

  const engineThemes = {
    cinematic: { color: '#3b82f6', label: 'Engine Alpha (Cinematic)' },
    photoreal: { color: '#fbbf24', label: 'Engine Beta (Photoreal)' },
    digital_art: { color: '#a855f7', label: 'Engine Gamma (Artistic)' },
    minimalist: { color: '#10b981', label: 'Engine Delta (Structural)' },
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
      setReasoning(initialDraft.reasoning || '');
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
    setReasoning(''); 
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
          guidance: parseFloat(guidanceScale),
          steps: parseInt(inferenceSteps)
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
      setReasoning(data.reasoning);
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
        
        {/* Sidebar Controls */}
        <div className="studio-sidebar glass-panel" style={{ borderLeft: `2px solid ${currentTheme.color}` }}>
          
          <div className="form-group">
            <label className="form-label" style={{ color: currentTheme.color }}>Aura Engine Core</label>
            <div className="engine-selector grid grid-cols-2 gap-2">
              {Object.entries(engineThemes).map(([key, value]) => (
                <button
                  key={key}
                  className={`btn-engine ${engine === key ? 'active' : ''}`}
                  style={{ 
                    '--theme-color': value.color,
                    borderColor: engine === key ? value.color : 'rgba(255,255,255,0.1)'
                  }}
                  onClick={() => setEngine(key)}
                >
                  {key.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Aesthetic Core</label>
            <textarea
              className="form-input font-mono"
              rows={2}
              placeholder="e.g. A melancholic jazz club..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isGenerating}
            />
          </div>

          {/* Generative Lab Sliders */}
          <div className="generative-lab section-border">
            <div className="form-group">
              <label className="form-label flex justify-between">
                Guidance Scale <span>{guidanceScale}</span>
              </label>
              <input
                type="range"
                min="1"
                max="15"
                step="0.5"
                value={guidanceScale}
                onChange={(e) => setGuidanceScale(parseFloat(e.target.value))}
                className="slider-themed"
                style={{ '--accent': currentTheme.color }}
              />
            </div>

            <div className="form-group">
              <label className="form-label flex justify-between">
                Inference Steps <span>{inferenceSteps}</span>
              </label>
              <input
                type="range"
                min="10"
                max="50"
                step="1"
                value={inferenceSteps}
                onChange={(e) => setInferenceSteps(parseInt(e.target.value))}
                className="slider-themed"
                style={{ '--accent': currentTheme.color }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Asset Count ({imageCount})</label>
            <input
              type="range"
              min="2"
              max="6"
              step="1"
              value={imageCount}
              onChange={(e) => setImageCount(parseInt(e.target.value))}
              disabled={isGenerating}
              style={{ width: '100%', accentColor: currentTheme.color }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Aspect Ratio</label>
            <div className="aspect-selector">
              {aspectOptions.map(opt => (
                <button
                  key={opt.id}
                  className={`btn-grid-option ${aspectRatio === opt.id ? 'active' : ''}`}
                  onClick={() => setAspectRatio(opt.id)}
                  style={{ borderColor: aspectRatio === opt.id ? currentTheme.color : '' }}
                >
                  {opt.name}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Structural Grid</label>
            <div className="grid grid-cols-2 gap-2">
              {activeLayouts.map(layout => (
                <button
                  key={layout}
                  className={`btn-grid-option ${selectedLayout === layout ? 'active' : ''}`}
                  onClick={() => setSelectedLayout(layout)}
                  style={{ borderColor: selectedLayout === layout ? currentTheme.color : '' }}
                >
                  {layout.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          <button
            className="btn-solid glow-button"
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            style={{ 
              width: '100%', 
              marginTop: '1rem', 
              background: currentTheme.color,
              filter: `drop-shadow(0 0 10px ${currentTheme.color}44)`
            }}
          >
            {isGenerating ? 'Diffusing...' : 'Generate Lab Board'}
          </button>

          {/* AI Reasoning Display */}
          {reasoning && !isGenerating && (
            <div className="ai-reasoning mt-6 p-4 rounded bg-white/5 border border-white/10 italic text-sm">
              <div className="text-xs uppercase tracking-widest opacity-50 mb-2 font-bold" style={{ color: currentTheme.color }}>System Rationale</div>
              "{reasoning}"
            </div>
          )}
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
