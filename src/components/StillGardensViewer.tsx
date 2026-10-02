import React, { useState } from 'react';
import { GardenView } from '../types/yukai';
import { templeAudio } from '../audio/TempleAudio';

interface StillGardensViewerProps {
  views: GardenView[];
  activeViewId: number | null;
  onClose: () => void;
  onSelectView: (id: number) => void;
}

export const StillGardensViewer: React.FC<StillGardensViewerProps> = ({
  views,
  activeViewId,
  onClose,
  onSelectView,
}) => {
  const [transitioning, setTransitioning] = useState(false);

  if (activeViewId === null) return null;

  const currentView = views.find((v) => v.id === activeViewId) || views[0];

  const handleSwitch = (id: number) => {
    if (id === activeViewId || transitioning) return;
    setTransitioning(true);
    templeAudio.playWaterDrop();
    setTimeout(() => {
      onSelectView(id);
      setTimeout(() => {
        setTransitioning(false);
      }, 50);
    }, 280);
  };

  return (
    <div
      className={`zen-modal-bg ${activeViewId !== null ? 'open' : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="zen-modal" role="dialog" aria-modal="true">
        <button
          type="button"
          className="zen-modal-close"
          onClick={onClose}
          aria-label="Fermer la contemplation du jardin"
          data-cursor
        >
          <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
            <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </button>

        <div className="flex items-center gap-3 text-xs tracking-widest text-[#aab4ad] uppercase mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#e0231c]" />
          <span>Carnets de terrain du jardin</span>
          <span className="text-[#78837c]">/</span>
          <span className="text-[#78837c] font-mono">{currentView.index}</span>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-[rgba(223,231,224,0.08)] pb-4">
          {views.map((v) => (
            <button
              key={v.id}
              type="button"
              data-cursor
              onClick={() => handleSwitch(v.id)}
              className={`px-4 py-2 text-xs tracking-widest uppercase transition-all duration-300 flex items-center gap-2 ${
                v.id === activeViewId
                  ? 'border-b-2 border-[#e0231c] text-[#dfe7e0] font-medium'
                  : 'text-[#78837c] hover:text-[#aab4ad]'
              }`}
            >
              <span>{v.title}</span>
              <span className="jp text-[11px] opacity-75">{v.kanji}</span>
            </button>
          ))}
        </div>

        {/* Dynamic Display Area with Crossfade */}
        <div
          className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center transition-all duration-500 ${
            transitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
          }`}
        >
          {/* Visual Showcase */}
          <div className="lg:col-span-7 relative group">
            <div className="relative aspect-[16/10] overflow-hidden border border-[rgba(223,231,224,0.18)] shadow-2xl">
              <img
                src={currentView.image}
                alt={currentView.title}
                className="w-full h-full object-cover filter brightness-90 saturate-90 transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#05070a] via-transparent to-transparent opacity-60" />

              {/* Breathing Ember Glow */}
              <i
                className={`glow ${currentView.glowProps.flame ? 'glow--flame' : ''}`}
                style={{
                  ['--gx' as string]: currentView.glowProps.gx,
                  ['--gy' as string]: currentView.glowProps.gy,
                  ['--gr' as string]: currentView.glowProps.gr,
                  ['--gt' as string]: currentView.glowProps.gt,
                  ['--gt2' as string]: currentView.glowProps.gt2,
                  ['--gc1' as string]: currentView.glowProps.gc1,
                  ['--gc2' as string]: currentView.glowProps.gc2,
                }}
              />

              <div className="absolute bottom-4 left-5 flex items-baseline gap-3">
                <span className="text-sm font-medium tracking-widest text-[#dfe7e0] uppercase">
                  {currentView.title}
                </span>
                <span className="jp text-xs text-[#aab4ad]">{currentView.kanji}</span>
              </div>
            </div>
            <div className="flex justify-between text-[10px] tracking-widest uppercase text-[#78837c] mt-2.5 px-1">
              <span>{currentView.subtitle}</span>
              <span>VUE EN DIRECT DU SANCTUAIRE THREE.JS</span>
            </div>
          </div>

          {/* Editorial Text Details */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="jp text-2xl text-[#dfe7e0] font-light mb-1">{currentView.kanji}</div>
            <h3 className="text-xl md:text-2xl font-light text-[#dfe7e0] tracking-tight mb-4">
              {currentView.title} — {currentView.subtitle}
            </h3>

            <p className="text-sm text-[#aab4ad] leading-relaxed mb-6 font-light">
              {currentView.description}
            </p>

            <blockquote className="border-l border-[#e0231c] pl-4 py-1 text-xs italic text-[#78837c] mb-6">
              "{currentView.quote}"
            </blockquote>

            <div className="flex items-center gap-4 pt-4 border-t border-[rgba(223,231,224,0.08)]">
              <span className="text-[10px] uppercase tracking-widest text-[#78837c]">Note de la cour</span>
              <span className="text-xs text-[#dfe7e0]">{currentView.index}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
