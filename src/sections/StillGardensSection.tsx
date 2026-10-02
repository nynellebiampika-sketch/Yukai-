import React from 'react';
import { GardenView } from '../types/yukai';

interface StillGardensSectionProps {
  views: GardenView[];
  onSelectGardenView: (id: number) => void;
}

export const StillGardensSection: React.FC<StillGardensSectionProps> = ({
  views,
  onSelectGardenView,
}) => {
  return (
    <section className="sec" id="pathways" data-cam="2">
      {/* Foreground Cutout Stage */}
      <div className="fg" data-fg="pathways" aria-hidden="true">
        <span className="fg-el fg-sakura fg-el--sway" data-fg-in="left">
          <img src="/sakura-branch.webp" alt="" width="1536" height="1024" loading="lazy" decoding="async" />
        </span>
        <span className="fg-el fg-leaves fg-el--sway" data-fg-in="right">
          <img src="/maple-leaves.webp" alt="" width="1536" height="1024" loading="lazy" decoding="async" />
        </span>
        <span className="fg-el fg-lantern" data-fg-in="up">
          <img src="/stone-lantern.webp" alt="" width="1024" height="1499" loading="lazy" decoding="async" />
        </span>
        <span className="fg-el fg-bush" data-fg-in="up">
          <img src="/garden-bush.webp" alt="" width="1717" height="876" loading="lazy" decoding="async" />
        </span>
      </div>

      <div className="sec-head" data-rv="fade">
        <span className="k">
          <b>02</b> — Jardins Immobiles
        </span>
        <span className="rule" />
        <span className="k jp">庭園</span>
      </div>

      {/* Interactive 3-card Gallery */}
      <div className="cards" id="cards">
        {views.map((view) => (
          <article
            key={view.id}
            className="card"
            data-view={view.id}
            data-rv="up"
            data-cursor
            onClick={() => onSelectGardenView(view.id)}
          >
            <div className="card-fr" data-frame>
              <span className="card-ar">
                <svg viewBox="0 0 14 14" fill="none">
                  <path d="M3 11 11 3M5 3h6v6" stroke="#dfe7e0" strokeWidth="1.3" />
                </svg>
              </span>
              <i
                className={`glow ${view.glowProps.flame ? 'glow--flame' : ''}`}
                style={{
                  ['--gx' as string]: view.glowProps.gx,
                  ['--gy' as string]: view.glowProps.gy,
                  ['--gr' as string]: view.glowProps.gr,
                  ['--gt' as string]: view.glowProps.gt,
                  ['--gt2' as string]: view.glowProps.gt2,
                  ['--gc1' as string]: view.glowProps.gc1,
                  ['--gc2' as string]: view.glowProps.gc2,
                }}
              />
              <div className="card-lab">
                <b>{view.title}</b>
                <span className="jp">{view.kanji}</span>
              </div>
            </div>
            <div className="card-meta">
              <span>{view.subtitle}</span>
              <span className="font-mono tabular-nums">{view.index}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
