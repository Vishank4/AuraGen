import React, { useState, useRef } from 'react';

export default function ShatterText({ text, baseClassName }) {
  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => {
    setIsHovering(false);
    setMousePos({ x: -1000, y: -1000 });
  };

  const letters = text.split('');

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={baseClassName}
      style={{ display: 'inline-flex', cursor: 'pointer', position: 'relative' }}
    >
      {letters.map((char, i) => {
        // Calculate physics per letter
        let dx = 0;
        let dy = 0;
        let rotate = 0;
        let scale = 1;

        if (isHovering && containerRef.current) {
          // Approx center of this specific letter (assuming 12px width per char roughly)
          const charLx = i * 11; 
          const charLy = 12; // vertical center roughly

          const distanceX = mousePos.x - charLx;
          const distanceY = mousePos.y - charLy;
          const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
          
          const radius = 60; // How close mouse needs to be to affect it
          
          if (distance < radius) {
            const force = (radius - distance) / radius;
            // The closer it is, the harder it repels. 
            // We use seeded random logic based on index to scatter in geometric "pixel" blocks
            const seedX = (Math.sin(i * 123.45) > 0 ? 1 : -1);
            const seedY = (Math.cos(i * 321.54) > 0 ? 1 : -1);
            
            dx = force * 40 * seedX;
            dy = force * 40 * seedY;
            rotate = force * 90 * seedX;
            scale = 1 - (force * 0.4); // shrink slightly into a "cube or pixel"
          }
        }

        // Space needs to be preserved
        if (char === ' ') {
          return <span key={i} style={{ width: '0.5em' }}>&nbsp;</span>;
        }

        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              transition: isHovering ? 'transform 0.1s cubic-bezier(0.1, 0.9, 0.2, 1)' : 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
              transform: `translate(${dx}px, ${dy}px) rotate(${rotate}deg) scale(${scale})`,
              transformOrigin: 'center center'
            }}
          >
            {char}
          </span>
        );
      })}
    </div>
  );
}
