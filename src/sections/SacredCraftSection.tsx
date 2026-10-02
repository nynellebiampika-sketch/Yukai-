import React from 'react';
import { SacredCraftLesson } from '../types/yukai';

interface SacredCraftSectionProps {
  lessons: SacredCraftLesson[];
  onSelectLesson: (lesson: SacredCraftLesson) => void;
}

export const SacredCraftSection: React.FC<SacredCraftSectionProps> = ({
  lessons,
  onSelectLesson,
}) => {
  return (
    <section className="sec" id="lessons" data-cam="3">
      {/* Foreground Cutout Stage */}
      <div className="fg" data-fg="lessons" aria-hidden="true">
        <span className="fg-el fg-wall fg-el--flip" data-fg-in="right">
          <img src="/temple-wall.webp" alt="" width="1536" height="884" loading="lazy" decoding="async" />
        </span>
        <span className="fg-el fg-stones" data-fg-in="up">
          <img src="/basalt-stones.webp" alt="" width="1536" height="996" loading="lazy" decoding="async" />
        </span>
        <span className="fg-el fg-grass" data-fg-in="up">
          <img src="/tall-grass.webp" alt="" width="1717" height="916" loading="lazy" decoding="async" />
        </span>
      </div>

      <div className="sec-head" data-rv="fade">
        <span className="k">
          <b>03</b> — Artisanat Sacré
        </span>
        <span className="rule" />
        <span className="k jp">手業</span>
      </div>

      <div className="cur-head">
        <h2 className="display h-sec">
          <span className="mask-line">
            <span>Cinq chapitres.</span>
          </span>
          <span className="mask-line">
            <span>Quatre-vingt-douze minutes.</span>
          </span>
          <span className="mask-line">
            <span>Un esprit apaisé.</span>
          </span>
        </h2>
        <p className="body-lg" data-rv="up">
          Chaque chapitre est une marche, pas une leçon magistrale. Vous arrivez à la porte, gravissez les marches, vous
          asseyez auprès de la lanterne, et repartez avec une chose précieuse à conserver.
        </p>
      </div>

      {/* Curriculum Grid */}
      <div className="cur" id="cur">
        {lessons.map((les) => (
          <div
            key={les.id}
            className="les"
            data-les={les.id}
            data-cursor
            onClick={() => onSelectLesson(les)}
          >
            <span className="les-img" aria-hidden="true">
              <img src={les.image} alt="" width="1536" height="884" loading="lazy" decoding="async" />
            </span>
            <span className="k font-mono">{les.num}</span>
            <h3>
              {les.title}
              <em className="jp">{les.kanji}</em>
            </h3>
            <p>{les.description}</p>
            <span className="t font-mono tabular-nums">{les.duration}</span>
            <i className="bar" />
          </div>
        ))}
      </div>
    </section>
  );
};
