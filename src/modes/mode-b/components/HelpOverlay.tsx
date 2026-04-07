'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const OBJECTS = [
  {
    icon: 'ðŸ–¥ï¸',
    name: 'Main Monitor',
    description: 'View my Projects â€” click to open full project carousel',
  },
  {
    icon: 'ðŸ“Ÿ',
    name: 'Vertical Monitor',
    description: 'View my Skills â€” interactive terminal skill display',
  },
  {
    icon: 'ðŸ““',
    name: 'Notebook',
    description: 'View my Experience â€” career timeline',
  },
  {
    icon: 'ðŸ¤–',
    name: 'Robot Figurine',
    description: 'About Me â€” learn about Nektarios Ioannou',
  },
  {
    icon: 'ðŸ“±',
    name: 'Tablet',
    description: 'Contact â€” email, phone, and location details',
  },
];

export function HelpOverlay() {
  const [open, setOpen] = useState(false);
  // Track whether the auto-open has fired so it only runs once
  const didAutoOpen = useRef(false);

  // Auto-open the guide 2.5 s after mount — gives the room time to load
  useEffect(() => {
    if (didAutoOpen.current) return;
    didAutoOpen.current = true;
    const timer = setTimeout(() => setOpen(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  // SSR guard — createPortal requires `document` to exist
  if (typeof document === 'undefined') return null;

  const ui = (
    <>
      {/* Persistent ? button â€” bottom-right corner, always visible */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Show interactive objects guide"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: 'rgba(15, 23, 42, 0.92)',
          border: '1.5px solid rgba(148, 163, 184, 0.45)',
          color: '#94a3b8',
          fontSize: '17px',
          fontWeight: 700,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          transition: 'background 0.18s, color 0.18s, border-color 0.18s, box-shadow 0.18s',
          fontFamily: 'inherit',
          lineHeight: 1,
        }}
        onMouseEnter={(e) => {
          const b = e.currentTarget as HTMLButtonElement;
          b.style.background = 'rgba(30, 41, 59, 0.98)';
          b.style.color = '#e2e8f0';
          b.style.borderColor = 'rgba(148, 163, 184, 0.8)';
          b.style.boxShadow = '0 4px 24px rgba(0,0,0,0.7)';
        }}
        onMouseLeave={(e) => {
          const b = e.currentTarget as HTMLButtonElement;
          b.style.background = 'rgba(15, 23, 42, 0.92)';
          b.style.color = '#94a3b8';
          b.style.borderColor = 'rgba(148, 163, 184, 0.45)';
          b.style.boxShadow = '0 4px 20px rgba(0,0,0,0.5)';
        }}
      >
        ?
      </button>

      {/* Modal */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            background: 'rgba(0, 0, 0, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(5px)',
            WebkitBackdropFilter: 'blur(5px)',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'rgba(10, 14, 28, 0.98)',
              border: '1px solid rgba(148, 163, 184, 0.18)',
              borderRadius: '18px',
              padding: '28px 28px 22px',
              width: '380px',
              maxWidth: '92vw',
              maxHeight: '90vh',
              overflowY: 'auto',
              color: '#e2e8f0',
              fontFamily: 'inherit',
              boxShadow: '0 30px 70px rgba(0,0,0,0.7)',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#f1f5f9', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Interactive Objects
              </h2>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                style={{
                  background: 'none', border: 'none', color: '#64748b',
                  fontSize: '22px', cursor: 'pointer', padding: '0 4px',
                  lineHeight: 1, fontFamily: 'inherit',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#cbd5e1'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#64748b'; }}
              >
                Ã—
              </button>
            </div>

            <p style={{ margin: '0 0 18px', fontSize: '12px', color: '#94a3b8', lineHeight: 1.65 }}>
              Click any highlighted object in the room to open its CV section:
            </p>

            {/* Object list */}
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {OBJECTS.map((obj) => (
                <li
                  key={obj.name}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '11px 13px',
                    background: 'rgba(30, 41, 59, 0.55)',
                    borderRadius: '10px',
                    border: '1px solid rgba(148, 163, 184, 0.09)',
                  }}
                >
                  <span style={{ fontSize: '20px', lineHeight: 1, flexShrink: 0, marginTop: '2px' }}>{obj.icon}</span>
                  <div>
                    <div style={{ fontSize: '12.5px', fontWeight: 600, color: '#cbd5e1', marginBottom: '2px' }}>{obj.name}</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', lineHeight: 1.55 }}>{obj.description}</div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Footer hints */}
            <div style={{ marginTop: '18px', paddingTop: '14px', borderTop: '1px solid rgba(148,163,184,0.1)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <p style={{ margin: 0, fontSize: '11px', color: '#475569', textAlign: 'center' }}>
                ðŸ–± Drag to orbit Â· Scroll to zoom
              </p>
              <p style={{ margin: 0, fontSize: '11px', color: '#475569', textAlign: 'center' }}>
                Press{' '}
                <kbd style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '4px', padding: '1px 6px', fontFamily: 'monospace', fontSize: '10px', color: '#94a3b8' }}>Q</kbd>
                {' '}or{' '}
                <kbd style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '4px', padding: '1px 6px', fontFamily: 'monospace', fontSize: '10px', color: '#94a3b8' }}>Esc</kbd>
                {' '}to dismiss a CV panel Â· click{' '}
                <strong style={{ color: '#64748b' }}>?</strong>
                {' '}to reopen this guide
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );

  // Portal to document.body â€” escapes all ancestor stacking contexts,
  // overflow:hidden, and transform containment blocks
  return createPortal(ui, document.body);
}
