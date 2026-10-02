import React from 'react';

interface SanmonSectionProps {
  onNavigate: (targetId: string) => void;
}

export const SanmonSection: React.FC<SanmonSectionProps> = ({ onNavigate }) => {
  return (
    <section className="sec" id="gate" data-cam="1">
      {/* Foreground Cutouts */}
      <div className="fg" data-fg="gate" aria-hidden="true">
        <span className="fg-el fg-wall" data-fg-in="left">
          <img src="/temple-wall.webp" alt="" width="1269" height="693" loading="lazy" decoding="async" />
        </span>
        <span className="fg-el fg-pine" data-fg-in="right">
          <img src="/pine-tree.webp" alt="" width="832" height="1248" loading="lazy" decoding="async" />
        </span>
        <span className="fg-el fg-grass" data-fg-in="up">
          <img src="/tall-grass.webp" alt="" width="1261" height="499" loading="lazy" decoding="async" />
        </span>
      </div>

      <div className="sec-head" data-rv="fade">
        <span className="k">
          <b>01</b> — Le Sanmon
        </span>
        <span className="rule" />
        <span className="k jp">山門</span>
      </div>

      <div className="gate-grid">
        <h2 className="display h-sec">
          <span className="mask-line">
            <span>Cyprès calciné, pierre</span>
          </span>
          <span className="mask-line">
            <span>usée, une porte</span>
          </span>
          <span className="mask-line">
            <span>laissée ouverte.</span>
          </span>
        </h2>

        <div className="gate-copy">
          <p className="lead" data-rv="up">
            Yukai commence là où la ville s’arrête : une porte de montagne en cèdre noirci au feu, dressée dans son propre climat.
            La suie n’est pas un ornement. C’est ainsi qu’une planche apprend à survivre à cent saisons des pluies, et la première
            chose que ce lieu vous invite à comprendre.
          </p>

          <p className="body" data-rv="up">
            Gravissez les marches usées par le temps et le pavillon de culte émerge de la brume, ses panneaux de papier illuminés de l’intérieur telle une
            lanterne de la taille d’une demeure. Au-dessus des avant-toits, une lune vermillon veille, patiente, à demi cachée.
            Ici, rien n’est pressé. Pour les quatre-vingt-douze prochaines minutes, vous ne l’êtes pas non plus.
          </p>

          <a
            className="arrowlink"
            href="#pathways"
            data-rv="fade"
            data-cursor
            onClick={(e) => {
              e.preventDefault();
              onNavigate('pathways');
            }}
          >
            <span>Franchir le seuil</span>
            <span className="ar">
              <svg viewBox="0 0 14 14" fill="none">
                <path d="M3 11 11 3M5 3h6v6" stroke="#dfe7e0" strokeWidth="1.3" />
              </svg>
            </span>
          </a>
        </div>
      </div>

      {/* Editorial Stats Presentation */}
      <div className="gate-stats" data-rv="up">
        <div>
          <b className="tabular-nums">05</b>
          <span>Chapitres</span>
        </div>
        <div>
          <b className="tabular-nums">92</b>
          <span>Minutes</span>
        </div>
        <div>
          <b className="tabular-nums">07</b>
          <span>Cours</span>
        </div>
        <div>
          <b>∞</b>
          <span>Sérénité</span>
        </div>
      </div>
    </section>
  );
};
