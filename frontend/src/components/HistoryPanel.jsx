import React from 'react';
import { History } from 'lucide-react';

export default function HistoryPanel({ history, onLoadHistory }) {
  if (history.length === 0) {
    return (
      <div className="glass-panel history-section" style={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', opacity: 0.5 }}>
        <History size={32} />
        <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>No history yet</p>
      </div>
    );
  }

  return (
    <div className="glass-panel history-section" style={{ flexGrow: 1 }}>
      <div className="input-group">
        <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <History size={16} /> Session History
        </label>
      </div>
      
      <div className="history-list">
        {history.map((item, index) => (
          <div key={index} className="history-item" onClick={() => onLoadHistory(item)}>
            <img src={item.images[0]} alt="thumb" className="history-thumb" />
            <div className="history-details">
              <span className="history-title">{item.prompt}</span>
              <span className="history-meta">{item.images.length} assets • {item.layout}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
