import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { portfolioData } from '../../data/portfolio';

export function Hero() {
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineIndex((prev) => (prev + 1) % portfolioData.taglines.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <section id="home" className="hero" ref={sectionRef}>
      <div className="hero-container">
        <motion.div
          className="hero-content-left"
          style={{
            transform: `translate(${mousePos.x * 0.1}px, ${mousePos.y * 0.1}px)`,
          }}
        >
          <div className="hero-greeting">// WELCOME TO MY UNIVERSE</div>
          <motion.h1
            className="hero-name"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            Aditya Jatav
          </motion.h1>
          <p className="hero-title">{portfolioData.title}</p>
          <motion.div
            className="hero-tagline-container"
            key={taglineIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
          >
            <div className="hero-tagline">{portfolioData.taglines[taglineIndex]}</div>
          </motion.div>
        </motion.div>

        <motion.div 
          className="hero-content-right"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5, type: 'spring', stiffness: 100 }}
        >
          <div className="hero-image-wrapper">
            <img src={portfolioData.photo} alt="Aditya Jatav" className="hero-profile-pic" />
            <div className="hero-image-glow"></div>
            <div className="hero-image-border"></div>
          </div>
        </motion.div>
      </div>

      <div className="hero-scroll-indicator">
        <div className="scroll-line" />
        <span className="scroll-text">Scroll</span>
      </div>
    </section>
  );
}
