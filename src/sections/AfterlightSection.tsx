import React from 'react';

interface AfterlightSectionProps {
  onRestart: () => void;
}

export const AfterlightSection: React.FC<AfterlightSectionProps> = ({ onRestart }) => {
  return (
    <section className="sec fin" id="eternity" data-cam="4">
      {/* Foreground Cutout Stage */}
      <div className="fg" data-fg="eternity" aria-hidden="true">
        <span className="fg-el fg-hill" data-fg-in="up">
          <img src="/hill.webp" alt="" width="1774" height="887" loading="lazy" decoding="async" />
        </span>
        <span className="fg-el fg-lantern" data-fg-in="left">
          <img src="/stone-lantern.webp" alt="" width="1024" height="1499" loading="lazy" decoding="async" />
        </span>
        <span className="fg-el fg-wall" data-fg-in="right">
          <img src="/temple-wall.webp" alt="" width="1536" height="884" loading="lazy" decoding="async" />
        </span>
        <span className="fg-el fg-grass" data-fg-in="up">
          <img src="/tall-grass.webp" alt="" width="1717" height="916" loading="lazy" decoding="async" />
        </span>
        <span className="fg-el fg-sakura" data-fg-in="left">
          <img src="/sakura-branch.webp" alt="" width="1536" height="1024" loading="lazy" decoding="async" />
        </span>
      </div>

      <div className="eyebrow" data-rv="fade">
        <span className="dot" /> Chapitre 04 — Lueur d’Après
      </div>

      <h2
        className="display h-sec"
        style={{ fontSize: 'clamp(56px, 9vw, 150px)', letterSpacing: '-0.04em' }}
      >
        <span className="mask-line">
          <span>Lueur d’après</span>
        </span>
      </h2>

      <p className="body-lg" data-rv="up">
        La porte ne se referme pas derrière vous. Reprenez cette marche dès que le bruit du monde s’intensifie : c’est
        toujours le même chemin, et jamais la même lumière.
      </p>

      <a
        className="cta"
        href="#top"
        data-rv="fade"
        data-cursor
        onClick={(e) => {
          e.preventDefault();
          onRestart();
        }}
      >
        <i />
        <span>Commencer la marche</span>
        <svg viewBox="0 0 14 14" fill="none" width="13" height="13">
          <path d="M3 11 11 3M5 3h6v6" stroke="#dfe7e0" strokeWidth="1.3" />
        </svg>
      </a>

      <div className="fin-v" aria-hidden="true">
        <span>Lueur d’après</span>
      </div>
    </section>
  );
};
