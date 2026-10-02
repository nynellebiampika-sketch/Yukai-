import React from 'react';

interface HeroSectionProps {
  onChipClick: (targetId: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onChipClick }) => {
  const chips = [
    { id: 'gate', num: '01', title: 'Seuils', desc: 'Découvrez les portes cachées qui ouvrent sur des sentiers plus profonds.' },
    { id: 'pathways', num: '02', title: 'Jardins Immobiles', desc: 'Contemplez les cours où le silence se déploie paisiblement.' },
    { id: 'lessons', num: '03', title: 'Artisanat Sacré', desc: 'Embrassez les mains et l’héritage qui façonnent la dévotion.' },
    { id: 'eternity', num: '04', title: 'Rituels Nocturnes', desc: 'Explorez les rites qui s’éveillent une fois le jour achevé.' },
  ];

  return (
    <section className="hero" id="hero" data-cam="0">
      {/* Foreground Cutout Stage */}
      <div className="fg" data-fg="hero" aria-hidden="true">
        <span className="fg-el fg-mound" data-fg-in="up">
          <img src="/tall-grass.webp" alt="" width="1717" height="916" decoding="async" />
        </span>
        <span className="fg-el fg-grass" data-fg-in="up">
          <img src="/tall-grass.webp" alt="" width="1717" height="916" decoding="async" />
        </span>
        <span className="fg-el fg-bush" data-fg-in="up">
          <img src="/garden-bush.webp" alt="" width="1717" height="876" decoding="async" />
        </span>
        <span className="fg-el fg-leaves fg-el--sway" data-fg-in="right">
          <img src="/maple-leaves.webp" alt="" width="1536" height="1024" decoding="async" />
        </span>
      </div>

      <div className="hero-top">
        <div className="eyebrow" data-rv="fade">
          <span className="dot" /> Chapitre 00 — La Porte Cachée
        </div>
        <h1 className="display h-hero">
          <span className="mask-line">
            <span>Où le calme</span>
          </span>
          <span className="mask-line">
            <span>révèle</span>
          </span>
          <span className="mask-line">
            <span>l’invisible.</span>
          </span>
        </h1>
        <p className="hero-sub body" data-rv="up">
          Pénétrez dans Kyoto à travers ses seuils silencieux, où rituel, artisanat et mémoire dessinent le chemin.
        </p>
      </div>

      <div className="hero-spacer" />

      <div className="hero-foot">
        <div className="hero-cue" data-rv="fade">
          <span>Faites défiler pour entrer</span>
          <span className="track">
            <i />
          </span>
        </div>

        <div className="chapters" id="chips">
          {chips.map((chip, idx) => (
            <div
              key={chip.id}
              className="chip"
              data-chip={idx}
              data-rv="up"
              data-cursor
              onClick={() => onChipClick(chip.id)}
            >
              <span className="num">{chip.num}</span>
              <span className="tx">
                <b>{chip.title}</b>
                <p>{chip.desc}</p>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Live Peek Portal */}
      <a
        className="peek"
        href="#pathways"
        data-view="3"
        data-rv="fade"
        data-cursor
        aria-label="Aperçu : Sanmon, avant la cloche"
        onClick={(e) => {
          e.preventDefault();
          onChipClick('pathways');
        }}
      >
        <span className="peek-fr" data-frame />
        <span className="peek-play">
          <svg viewBox="0 0 22 22" fill="none">
            <path d="M8 5.6 16.4 11 8 16.4z" fill="#dfe7e0" />
          </svg>
        </span>
        <span className="peek-cap">
          <b className="jp">山門</b>
          <i>Sanmon — avant la cloche</i>
        </span>
      </a>

      {/* Fallback Wordmark */}
      <div className="word-fb" aria-hidden="true">
        YUKAI
      </div>

      <div className="hero-side" data-rv="up">
        <span className="v jp">影の道</span>
      </div>
    </section>
  );
};
