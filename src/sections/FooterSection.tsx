import React from 'react';

interface FooterSectionProps {
  onNavigate: (targetId: string) => void;
}

export const FooterSection: React.FC<FooterSectionProps> = ({ onNavigate }) => {
  return (
    <footer className="foot" data-cam="5">
      {/* Foreground Cutout Stage */}
      <div className="fg" data-fg="foot" aria-hidden="true">
        <span className="fg-el fg-bush" data-fg-in="up">
          <img src="/garden-bush.webp" alt="" width="1717" height="876" loading="lazy" decoding="async" />
        </span>
        <span className="fg-el fg-grass" data-fg-in="up">
          <img src="/tall-grass.webp" alt="" width="1717" height="916" loading="lazy" decoding="async" />
        </span>
        <span className="fg-el fg-stones" data-fg-in="up">
          <img src="/basalt-stones.webp" alt="" width="1536" height="996" loading="lazy" decoding="async" />
        </span>
      </div>

      <div className="foot-grid">
        <div className="foot-brand" data-rv="up">
          <svg viewBox="0 0 44 44" fill="none" width="34" height="34" aria-hidden="true">
            <circle cx="22" cy="25" r="8.6" fill="#e0231c" fillOpacity="0.9" />
            <path d="M5 13h34M9 18.4h26M22 8.5v27" stroke="#dfe7e0" strokeWidth="1.5" />
          </svg>
          <p>
            Une marche nocturne en cinq chapitres à travers un temple de montagne à Kyoto. Trois carnets de terrain illustrés prennent vie au cœur d’un sanctuaire Three.js en direct.
          </p>
        </div>

        <div data-rv="up">
          <h4>Chapitres</h4>
          <ul>
            <li>
              <a
                href="#gate"
                data-cursor
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('gate');
                }}
              >
                Le Sanmon
              </a>
            </li>
            <li>
              <a
                href="#pathways"
                data-cursor
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('pathways');
                }}
              >
                Jardins Immobiles
              </a>
            </li>
            <li>
              <a
                href="#lessons"
                data-cursor
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('lessons');
                }}
              >
                Artisanat Sacré
              </a>
            </li>
            <li>
              <a
                href="#eternity"
                data-cursor
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('eternity');
                }}
              >
                Lueur d’Après
              </a>
            </li>
          </ul>
        </div>

        <div data-rv="up">
          <h4>Pratique</h4>
          <ul>
            <li>
              <a
                href="#lessons"
                data-cursor
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('lessons');
                }}
              >
                Paysage emprunté
              </a>
            </li>
            <li>
              <a
                href="#lessons"
                data-cursor
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('lessons');
                }}
              >
                Lueur de lanterne
              </a>
            </li>
            <li>
              <a
                href="#lessons"
                data-cursor
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('lessons');
                }}
              >
                Cyprès calciné
              </a>
            </li>
            <li>
              <a
                href="#lessons"
                data-cursor
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('lessons');
                }}
              >
                Gravier ratissé
              </a>
            </li>
          </ul>
        </div>

        <div data-rv="up">
          <h4>Ailleurs</h4>
          <ul>
            <li>
              <a
                href="#top"
                data-cursor
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('top');
                }}
              >
                Journal
              </a>
            </li>
            <li>
              <a
                href="#top"
                data-cursor
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('top');
                }}
              >
                Carnets de terrain
              </a>
            </li>
            <li>
              <a
                href="#top"
                data-cursor
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('top');
                }}
              >
                Colophon
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="foot-base">
        <span>© 2026 Yukai — Yukai no Michi</span>
        <span className="jp">静けさは一つの技である</span>
        <span>WebGL · Onest · Kyoto</span>
      </div>
    </footer>
  );
};
