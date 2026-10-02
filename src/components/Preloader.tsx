import React, { useEffect, useState } from 'react';

interface PreloaderProps {
  onLoaded: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onLoaded }) => {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [isGone, setIsGone] = useState(false);

  useEffect(() => {
    const assetsToLoad = [
      '/tall-grass.webp',
      '/garden-bush.webp',
      '/maple-leaves.webp',
      '/temple-wall.webp',
      '/pine-tree.webp',
      '/sakura-branch.webp',
      '/stone-lantern.webp',
      '/basalt-stones.webp',
      '/hill.webp',
      '/kage-approach.webp',
      '/kage-lantern-court.webp',
      '/kage-moonwater.webp',
      '/kage-sanmon-preview.webp',
    ];

    let loadedCount = 0;
    const total = assetsToLoad.length;

    const updateProgress = () => {
      loadedCount++;
      const currentPct = Math.min(100, Math.round((loadedCount / total) * 100));
      setProgress((prev) => Math.max(prev, currentPct));
      if (loadedCount >= total) {
        finishLoading();
      }
    };

    // Preload image elements
    assetsToLoad.forEach((src) => {
      const img = new Image();
      img.onload = updateProgress;
      img.onerror = updateProgress;
      img.src = src;
    });

    // Synthetic progress interval to guarantee steady feeling if cached
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 90) {
          return prev + Math.floor(Math.random() * 8) + 4;
        }
        return prev;
      });
    }, 120);

    let finished = false;
    const finishLoading = () => {
      if (finished) return;
      finished = true;
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => {
        setIsDone(true);
        setTimeout(() => {
          setIsGone(true);
          onLoaded();
        }, 800);
      }, 350);
    };

    // Safety timeout
    const timeout = setTimeout(finishLoading, 2800);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [onLoaded]);

  if (isGone) return null;

  return (
    <div id="pre" className={isDone ? 'gone' : ''}>
      <div className="pre-in">
        <div className="pre-mark">
          <svg viewBox="0 0 44 44" fill="none" aria-hidden="true" className="w-11 h-11 mx-auto">
            <circle cx="22" cy="24" r="9.5" stroke="#e0231c" strokeWidth="1.2" />
            <path d="M6 12h32M9.5 17h25M22 8v28" stroke="#dfe7e0" strokeWidth="1.2" />
          </svg>
        </div>
        <div className="pre-jp jp">影の道</div>
        <div className="pre-bar">
          <i id="pre-fill" style={{ right: `${100 - progress}%` }} />
        </div>
        <div className="pre-meta">
          <span>Raising the mountain temple</span>
          <b>
            <span id="pre-pct">{progress}</span>%
          </b>
        </div>
      </div>
    </div>
  );
};
