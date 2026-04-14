import React from 'react';
import { motion } from 'framer-motion';

export default function DynamicGrid({ images, layout, imageCount }) {
  if (!images || images.length === 0) return null;

  // Ensure we only render the requested number of images
  const displayImages = images.slice(0, imageCount);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: 'spring', stiffness: 200, damping: 20 }
    }
  };

  return (
    <motion.div 
      className={`mood-grid layout-${imageCount}-${layout}`}
      variants={containerVariants}
      initial="hidden"
      animate="show"
      key={images[0]} // re-trigger animation when images change completely
    >
      {displayImages.map((src, idx) => (
        <motion.div key={idx} className="image-container" variants={itemVariants}>
          <img src={src} alt={`Mood asset ${idx + 1}`} className="grid-image" crossOrigin="anonymous" />
        </motion.div>
      ))}
    </motion.div>
  );
}
