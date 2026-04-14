import React from 'react';

// Generates a 20x20 grid of "pixels" spanning the screen
// Each pixel flips to the new theme color in a staggered domino effect
export default function DominoFlash({ isFlashing, theme }) {
  if (!isFlashing) return null;

  const cols = 20;
  const rows = 20;
  const totalPixels = cols * rows;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        pointerEvents: 'none',
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
      }}
    >
      {Array.from({ length: totalPixels }).map((_, i) => {
        const x = i % cols;
        const y = Math.floor(i / cols);
        
        // Calculate domino wave delay (top-left to bottom-right flow)
        // 10ms per step creates a very fast, repowering domino sweep
        const delay = (x + y) * 15;

        // Base color depends on the TARGET theme we are switching TO.
        // If theme='light' in state, that means we are currently switching TO light.
        // However, App.jsx swaps the `theme` variable halfway through the flash.
        // We calculate target color purely via CSS animations to hide the DOM change.
        return (
          <div
            key={i}
            className={`domino-pixel ${theme === 'light' ? 'flash-light' : 'flash-dark'}`}
            style={{
              animationDelay: `${delay}ms`,
            }}
          />
        );
      })}
    </div>
  );
}
