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
          <b>01</b> — The Sanmon
        </span>
        <span className="rule" />
        <span className="k jp">山門</span>
      </div>

      <div className="gate-grid">
        <h2 className="display h-sec">
          <span className="mask-line">
            <span>Charred cypress, worn</span>
          </span>
          <span className="mask-line">
            <span>stone, one gate</span>
          </span>
          <span className="mask-line">
            <span>left open.</span>
          </span>
        </h2>

        <div className="gate-copy">
          <p className="lead" data-rv="up">
            Yukai begins where the city stops: a mountain gate of cedar burned black, standing in its own weather.
            The soot is not decoration. It is how a board is taught to survive a hundred rainy seasons, and the first
            thing this place asks you to understand.
          </p>

          <p className="body" data-rv="up">
            Climb the worn steps and the worship hall lifts out of the mist, its paper screens lit from inside like a
            lantern the size of a house. Above the eaves a vermilion moon holds its place, patient, half hidden.
            Nothing here is in a hurry. Neither, for the next ninety minutes, are you.
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
            <span>Cross the threshold</span>
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
          <span>Chapters</span>
        </div>
        <div>
          <b className="tabular-nums">92</b>
          <span>Minutes</span>
        </div>
        <div>
          <b className="tabular-nums">07</b>
          <span>Courts</span>
        </div>
        <div>
          <b>∞</b>
          <span>Stillness</span>
        </div>
      </div>
    </section>
  );
};
