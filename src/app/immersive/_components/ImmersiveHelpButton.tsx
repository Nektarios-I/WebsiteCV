'use client';

/**
 * ImmersiveHelpButton — floating "?" guide for Mode B
 *
 * Uses position:fixed so it renders above the WebGL canvas compositor layer.
 * The Loader (also fixed) proves this works — fixed creates a viewport-level
 * stacking context that sits above GPU-composited layers.
 *
 * ModeBRoot's ancestor chain has NO transform/filter/perspective that would
 * contain fixed positioning, so fixed is always viewport-relative here.
 *
 * NO backdropFilter — filter CSS over a WebGL <canvas> stalls loading.
 *
 * Press P to toggle • Q or Esc to close the CV panel.
 */

import { useEffect, useState } from 'react';

const OBJECTS = [
  {
    icon: '[MON]',
    name: 'Main Monitor',
    desc: 'Projects — click to browse the full project list.',
  },
  {
    icon: '[VRT]',
    name: 'Vertical Monitor',
    desc: 'Skills — interactive skill categories.',
  },
  { icon: '[NTB]', name: 'Notebook', desc: 'Experience — career timeline.' },
  {
    icon: '[BOT]',
    name: 'Robot Figurine',
    desc: 'About — learn about Nektarios Ioannou.',
  },
  { icon: '[TAB]', name: 'Tablet', desc: 'Contact — email, phone, location.' },
];

/* ─── Shared inline style tokens ─────────────────────────────────────────── */
const TEAL = 'rgba(20,184,166,0.85)';
const TEAL_DIM = 'rgba(20,184,166,0.2)';
const PANEL_BG = 'rgb(6,10,18)';
const BORDER = '1px solid rgba(20,184,166,0.22)';

export function ImmersiveHelpButton() {
  const [open, setOpen] = useState(false);

  // P key toggles the guide; Esc closes it
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'p' || e.key === 'P') setOpen((v) => !v);
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  /*
   * position:fixed — creates a viewport-level stacking context above the
   * GPU-composited WebGL canvas, just like the Loader does. No containing
   * block issues — ModeBRoot's ancestor chain has no transform/filter.
   */
  return (
    <>
      {/* ── [?] keyboard-key button ─────────────────────────────────── */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Show interactive objects guide (P)"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 300,
          width: '36px',
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '6px',
          background: PANEL_BG,
          border: BORDER,
          /* keycap shadow: bottom edge highlight + ambient drop */
          boxShadow: `0 2px 0 ${TEAL_DIM}, 0 4px 16px rgba(0,0,0,0.7)`,
          color: TEAL,
          fontSize: '16px',
          fontWeight: 700,
          fontFamily: 'monospace',
          cursor: 'pointer',
          lineHeight: 1,
          /* NO backdropFilter — filter over WebGL canvas stalls loading */
        }}
      >
        ?
      </button>

      {/* ── Guide modal ─────────────────────────────────────────────── */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 400,
            background: 'rgba(0,0,0,0.72)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: PANEL_BG,
              border: BORDER,
              borderRadius: '12px',
              padding: '24px 24px 20px',
              width: '400px',
              maxWidth: '90vw',
              maxHeight: '84vh',
              overflowY: 'auto',
              color: '#e2e8f0',
              fontFamily: 'monospace',
              boxShadow: '0 32px 80px rgba(0,0,0,0.8)',
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '14px',
              }}
            >
              <span
                style={{
                  color: TEAL,
                  fontSize: '12px',
                  letterSpacing: '0.06em',
                }}
              >
                $ ls interactive-objects/
              </span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close guide"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  fontSize: '22px',
                  cursor: 'pointer',
                  lineHeight: 1,
                  padding: '0 2px',
                  fontFamily: 'monospace',
                }}
              >
                ×
              </button>
            </div>

            {/* Object list */}
            <ul
              style={{
                margin: 0,
                padding: 0,
                listStyle: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              {OBJECTS.map((obj) => (
                <li
                  key={obj.name}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    padding: '9px 12px',
                    background: 'rgba(20,184,166,0.04)',
                    borderRadius: '7px',
                    borderLeft: `2px solid ${TEAL_DIM}`,
                  }}
                >
                  <span
                    style={{
                      flexShrink: 0,
                      color: TEAL,
                      fontSize: '11px',
                      paddingTop: '1px',
                      width: '36px',
                    }}
                  >
                    {obj.icon}
                  </span>
                  <div>
                    <div
                      style={{
                        fontSize: '12.5px',
                        fontWeight: 600,
                        color: '#cbd5e1',
                        marginBottom: '2px',
                      }}
                    >
                      {obj.name}
                    </div>
                    <div
                      style={{
                        fontSize: '11px',
                        color: '#94a3b8',
                        lineHeight: 1.5,
                      }}
                    >
                      {obj.desc}
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Footer shortcuts */}
            <div
              style={{
                marginTop: '16px',
                paddingTop: '12px',
                borderTop: `1px solid ${TEAL_DIM}`,
                color: '#475569',
                fontSize: '11px',
                textAlign: 'center',
                lineHeight: 1.7,
              }}
            >
              Drag to orbit · Scroll to zoom · Click objects to explore
              <br />
              <span style={{ color: '#334155' }}>
                Press <KbdKey>P</KbdKey> to toggle guide · <KbdKey>Q</KbdKey>/
                <KbdKey>Esc</KbdKey> to close panel
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function KbdKey({ children }: { children: React.ReactNode }) {
  return (
    <kbd
      style={{
        background: 'rgba(20,184,166,0.08)',
        border: '1px solid rgba(20,184,166,0.25)',
        borderRadius: '4px',
        padding: '0 5px',
        fontSize: '10px',
        fontFamily: 'monospace',
        color: 'rgba(20,184,166,0.7)',
      }}
    >
      {children}
    </kbd>
  );
}
