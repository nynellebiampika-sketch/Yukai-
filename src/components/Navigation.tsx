import React, { useState, useEffect } from 'react';
import { templeAudio } from '../audio/TempleAudio';

interface NavigationProps {
  activeSection: string;
  onNavigate: (targetId: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeSection, onNavigate }) => {
  const [isStuck, setIsStuck] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsStuck(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    document.body.classList.remove('is-locked');
    templeAudio.playBell(520, 2.5);
    onNavigate(targetId);
  };

  const toggleSound = () => {
    const muted = templeAudio.toggleMute();
    setIsMuted(muted);
  };

  const toggleMobileMenu = () => {
    const nextState = !isMenuOpen;
    setIsMenuOpen(nextState);
    if (nextState) {
      document.body.classList.add('is-locked');
    } else {
      document.body.classList.remove('is-locked');
    }
  };

  const navItems = [
    { id: 'gate', label: 'Temples', kanji: '伽藍' },
    { id: 'pathways', label: 'Jardins', kanji: '庭園' },
    { id: 'lessons', label: 'Rituels', kanji: '神事' },
    { id: 'eternity', label: "Lueur d'Après", kanji: '残光' },
  ];

  return (
    <header className={`nav ${isStuck ? 'is-stuck' : ''}`} id="nav">
      <a
        className="brand"
        href="#top"
        data-cursor
        onClick={(e) => handleLinkClick(e, 'top')}
      >
        <svg viewBox="0 0 44 44" fill="none" aria-hidden="true" width="28" height="28">
          <circle cx="22" cy="25" r="8.6" fill="#e0231c" fillOpacity="0.9" />
          <path d="M5 13h34M9 18.4h26M22 8.5v27" stroke="#dfe7e0" strokeWidth="1.5" />
          <path d="M14 35.5h16" stroke="#dfe7e0" strokeWidth="1.2" strokeOpacity="0.6" />
        </svg>
        <span className="brand-tx">
          <b>YUKAI</b>
          <i>ROYAUMES SECRETS DE KYOTO</i>
        </span>
      </a>

      <nav className={`nav-links ${isMenuOpen ? 'open' : ''}`} id="navlinks">
        {navItems.map((item) => (
          <a
            key={item.id}
            className={`nav-link ${activeSection === item.id ? 'is-cur' : ''}`}
            href={`#${item.id}`}
            data-cursor
            onClick={(e) => handleLinkClick(e, item.id)}
          >
            <span>{item.label}</span>
            <span className="alt jp">{item.kanji}</span>
          </a>
        ))}

        <button
          type="button"
          onClick={toggleSound}
          className={`sound-btn ${!isMuted ? 'is-active' : ''}`}
          data-cursor
          aria-label={isMuted ? 'Activer le son ambiant du temple' : 'Couper le son'}
          title={isMuted ? 'Activer le son ambiant du temple' : 'Couper le son'}
        >
          <div className={`sound-waves ${!isMuted ? 'active' : ''}`}>
            <span style={{ height: isMuted ? '3px' : undefined }} />
            <span style={{ height: isMuted ? '6px' : undefined }} />
            <span style={{ height: isMuted ? '3px' : undefined }} />
          </div>
          <span className="jp">{isMuted ? '静寂' : '残響'}</span>
        </button>
      </nav>

      <button
        className={`nav-burger ${isMenuOpen ? 'on' : ''}`}
        id="burger"
        aria-label="Menu de navigation"
        data-cursor
        onClick={toggleMobileMenu}
      >
        <i />
        <i />
      </button>
    </header>
  );
};
