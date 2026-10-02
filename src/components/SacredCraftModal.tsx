import React from 'react';
import { SacredCraftLesson } from '../types/yukai';

interface SacredCraftModalProps {
  lesson: SacredCraftLesson | null;
  onClose: () => void;
}

export const SacredCraftModal: React.FC<SacredCraftModalProps> = ({ lesson, onClose }) => {
  if (!lesson) return null;

  return (
    <div
      className={`zen-modal-bg ${lesson ? 'open' : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="zen-modal" role="dialog" aria-modal="true">
        <button
          type="button"
          className="zen-modal-close"
          onClick={onClose}
          aria-label="Close chapter meditation"
          data-cursor
        >
          <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
            <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </button>

        <div className="flex items-center gap-3 text-xs tracking-widest text-[#aab4ad] uppercase mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#e0231c]" />
          <span>Chapter Walk {lesson.num}</span>
          <span className="text-[#78837c]">/</span>
          <span className="text-[#78837c] font-mono">{lesson.duration}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-6 relative aspect-[16/10] overflow-hidden border border-[rgba(223,231,224,0.15)] shadow-2xl">
            <img
              src={lesson.image}
              alt={lesson.title}
              className="w-full h-full object-cover filter brightness-90 saturate-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#05070a] via-transparent to-transparent opacity-60" />
            <div className="absolute bottom-4 left-5">
              <span className="jp text-2xl text-[#dfe7e0] font-light">{lesson.kanji}</span>
            </div>
          </div>

          <div className="md:col-span-6">
            <h3 className="text-2xl font-light text-[#dfe7e0] tracking-tight mb-2">
              {lesson.title} <span className="jp text-base text-[#aab4ad] ml-2">{lesson.kanji}</span>
            </h3>

            <p className="text-sm text-[#dfe7e0] leading-relaxed mb-4 font-light">
              {lesson.description}
            </p>

            <p className="text-sm text-[#aab4ad] leading-relaxed mb-6 font-light">
              {lesson.contemplation}
            </p>

            <div className="space-y-2 border-t border-[rgba(223,231,224,0.08)] pt-4">
              <div className="text-[10px] uppercase tracking-widest text-[#78837c] mb-2">
                Meditation Threads
              </div>
              {lesson.details.map((d, idx) => (
                <div key={idx} className="flex items-baseline gap-2 text-xs text-[#aab4ad]">
                  <span className="text-[#e0231c] text-xs">·</span>
                  <span>{d}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
