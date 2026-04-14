import React from 'react';
import { Sparkles, Image as ImageIcon, LayoutGrid } from 'lucide-react';

export default function InputPanel({
  prompt,
  setPrompt,
  imageCount,
  setImageCount,
  selectedLayout,
  setSelectedLayout,
  onGenerate,
  isGenerating
}) {
  
  // Layout options based on selected image count
  const layoutOptions = {
    2: [{ id: 'split', name: 'Split' }, { id: 'stacked', name: 'Stacked' }],
    3: [{ id: 'hero', name: 'Hero' }, { id: 'row', name: 'Row' }],
    4: [{ id: 'grid', name: '2x2 Grid' }, { id: 'hero', name: 'Hero Main' }],
    5: [{ id: 'bento', name: 'Bento Box' }],
    6: [{ id: 'masonry', name: 'Masonry' }, { id: 'complex', name: 'Complex' }]
  };

  const currentLayoutOptions = layoutOptions[imageCount];

  // If user changes image count, automatically select the first valid layout
  React.useEffect(() => {
    if (!currentLayoutOptions.find(o => o.id === selectedLayout)) {
      setSelectedLayout(currentLayoutOptions[0].id);
    }
  }, [imageCount, currentLayoutOptions, selectedLayout, setSelectedLayout]);

  return (
    <div className="glass-panel input-section">
      <div className="input-group">
        <label className="input-label">
          Aesthetic / Vibe
        </label>
        <textarea
          className="aesthetic-input"
          rows={3}
          placeholder="e.g. A melancholic jazz club on a rainy night in a cyberpunk city..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isGenerating}
        />
      </div>

      <div className="input-group">
        <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ImageIcon size={16} /> Asset Count
        </label>
        <div className="slider-container">
          <input
            type="range"
            min="2"
            max="6"
            step="1"
            className="slider"
            value={imageCount}
            onChange={(e) => setImageCount(parseInt(e.target.value))}
            disabled={isGenerating}
          />
          <span className="value-badge">{imageCount}</span>
        </div>
      </div>

      <div className="input-group">
        <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <LayoutGrid size={16} /> Grid Layout
        </label>
        <div className="layout-selector">
          {currentLayoutOptions.map((layout) => (
            <button
              key={layout.id}
              className={`layout-btn ${selectedLayout === layout.id ? 'active' : ''}`}
              onClick={() => setSelectedLayout(layout.id)}
              disabled={isGenerating}
            >
              {layout.name}
            </button>
          ))}
        </div>
      </div>

      <button
        className="btn-primary"
        onClick={onGenerate}
        disabled={isGenerating || !prompt.trim()}
        style={{ marginTop: '0.5rem' }}
      >
        {isGenerating ? (
          <>
            <Sparkles size={18} className="animate-pulse" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles size={18} />
            Generate Board
          </>
        )}
      </button>
    </div>
  );
}
