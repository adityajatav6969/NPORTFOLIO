import { useEffect, useState } from 'react';
import { useUIStore } from '../../store/uiStore';

const bootMessages = [
  '> Initializing neural interface...',
  '> Loading quantum renderer...',
  '> Syncing particle matrix...',
  '> Calibrating holographic display...',
  '> Establishing neural link...',
  '> System ready.',
];

export function LoadingScreen() {
  const { isLoading, loadingProgress, setLoading, setLoadingProgress } = useUIStore();
  const [visibleLines, setVisibleLines] = useState<string[]>([]);

  useEffect(() => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        progress = 100;
        setLoadingProgress(100);
        setTimeout(() => setLoading(false), 800);
        clearInterval(interval);
      } else {
        setLoadingProgress(Math.min(progress, 100));
      }
    }, 200);

    return () => clearInterval(interval);
  }, [setLoading, setLoadingProgress]);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < bootMessages.length) {
        setVisibleLines((prev) => [...prev, bootMessages[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`loading-screen ${!isLoading ? 'hidden' : ''}`}>
      <div className="loading-logo">ADITYA</div>
      <div className="loading-bar-container">
        <div
          className="loading-bar"
          style={{ width: `${loadingProgress}%` }}
        />
      </div>
      <div className="loading-text">
        {Math.round(loadingProgress)}% — INITIALIZING
      </div>
      <div className="loading-boot-lines">
        {visibleLines.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>
    </div>
  );
}
