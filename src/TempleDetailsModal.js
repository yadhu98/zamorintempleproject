import React, { useEffect } from 'react';
import Slideshow from './ImageSlider';

const Backdrop = ({ children, onClose }) => (
  <div
    onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    onWheel={(e) => e.stopPropagation()}
    onTouchMove={(e) => e.stopPropagation()}
    onScroll={(e) => e.stopPropagation()}
    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2300 }}
  >
    {children}
  </div>
);

export default function TempleDetailsModal({ isOpen, onClose, temple, lang = 'en', t = (x) => x, toMlName, toMlDetails }) {
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.classList.add('modal-open');
    return () => {
      document.body.style.overflow = prev;
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  if (!isOpen || !temple) return null;

  const name = lang === 'ml' ? (temple.name_ml || (toMlName ? toMlName(temple.name) : temple.name)) : temple.name;
  const details = lang === 'ml' ? (temple.details_ml || (toMlDetails ? toMlDetails(temple.details) : temple.details)) : temple.details;

  return (
    <Backdrop onClose={onClose}>
      <div className="temple-modal">
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} aria-label="Close" style={{ background: 'transparent', border: 'none', fontSize: 18, cursor: 'pointer' }}>✕</button>
        </div>
        <Slideshow slides={temple?.slides} />
        <h2 style={{ fontSize: lang === 'ml' ? '1.05rem' : '1.15rem' }}>{t('zamorins')} {name}</h2>
        <p style={{ fontSize: lang === 'ml' ? '0.95rem' : '1rem' }}>{details}</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            style={{ backgroundColor: '#E68057', color: 'white', border: 'none', borderRadius: '4px', padding: '0.5rem 1rem', cursor: 'pointer' }}
            onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${temple?.coordinates.lat},${temple?.coordinates.lng}`, '_blank')}
          >
            Get Directions
          </button>
          <button
            style={{ backgroundColor: '#a2574f', color: 'white', border: 'none', borderRadius: '4px', padding: '0.5rem 1rem', cursor: 'pointer' }}
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </Backdrop>
  );
}
