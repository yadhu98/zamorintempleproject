import React from 'react';

const Backdrop = ({ children, onClose }) => (
  <div
    onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2100 }}
  >
    {children}
  </div>
);

export default function InfoManual({ isOpen, onClose, t, lang }) {
  if (!isOpen) return null;
  return (
    <Backdrop onClose={onClose}>
      <div className="info-manual">
        <div className="info-manual-header">
          <h3 style={{ margin: 0 }}>{t('help.title')}</h3>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: 18, cursor: 'pointer' }}>✕</button>
        </div>
        <div className="info-manual-body">
          <h4>{t('help.section.gettingStarted')}</h4>
          <ol>
            <li>{t('help.step.openPlanner')}</li>
            <li>{t('help.step.setStart')}</li>
            <li>{t('help.step.selectTemples')}</li>
            <li>{t('help.step.optimize')}</li>
            <li>{t('help.step.planRoute')}</li>
          </ol>
          <h4>{t('help.section.onMap')}</h4>
          <ul>
            <li>{t('help.tip.labels')}</li>
            <li>{t('help.tip.summary')}</li>
            <li>{t('help.tip.fitClear')}</li>
          </ul>
          <h4>{t('help.section.navigation')}</h4>
          <ul>
            <li>{t('help.nav.inApp')}</li>
            <li>{t('help.nav.google')}</li>
          </ul>
          <h4>{t('help.section.notes')}</h4>
          <ul>
            <li>{t('help.note.permissions')}</li>
            <li>{t('help.note.heading')}</li>
            <li>{t('help.note.osrm')}</li>
          </ul>
        </div>
        <div className="info-manual-footer">
          <button onClick={onClose} style={{ background: '#eee', border: '1px solid #ccc', padding: '8px 12px', borderRadius: 4, cursor: 'pointer' }}>{t('common.close')}</button>
        </div>
      </div>
    </Backdrop>
  );
}
