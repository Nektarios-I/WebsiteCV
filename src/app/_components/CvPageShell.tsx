'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';

const TEAL = '#14b8a6';
const BG = 'rgb(6, 10, 18)';

interface CvPageShellProps {
  /** Short page name shown in the top-left after the logo */
  pageTitle: string;
  children: ReactNode;
}

/**
 * Shared full-screen wrapper used by all CV section pages
 * (/about, /skills, /experience, /contact).
 * Provides:
 *  - Animated teal gradient orbs background
 *  - Top header with page label + "Back to Room" button
 *  - Scrollable content area
 */
export function CvPageShell({ pageTitle, children }: CvPageShellProps) {
  return (
    <>
      <style>{`
        html, body { margin: 0; padding: 0; background: ${BG}; }

        @keyframes orbDrift1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33%       { transform: translate(40px, -30px) scale(1.08); }
          66%       { transform: translate(-20px, 20px) scale(0.95); }
        }
        @keyframes orbDrift2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          40%       { transform: translate(-50px, 30px) scale(1.05); }
          70%       { transform: translate(30px, -20px) scale(1.1); }
        }
        @keyframes orbDrift3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%       { transform: translate(25px, 40px) scale(0.92); }
        }
        .cv-orb1 { animation: orbDrift1 18s ease-in-out infinite; }
        .cv-orb2 { animation: orbDrift2 24s ease-in-out infinite; }
        .cv-orb3 { animation: orbDrift3 30s ease-in-out infinite; }

        ::-webkit-scrollbar            { width: 6px; }
        ::-webkit-scrollbar-track      { background: transparent; }
        ::-webkit-scrollbar-thumb      { background: rgba(20,184,166,0.3); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover{ background: rgba(20,184,166,0.6); }
      `}</style>

      {/* Root */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: BG,
          fontFamily: 'var(--font-geist-sans, system-ui, sans-serif)',
          color: 'rgba(255,255,255,0.87)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Orbs */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            overflow: 'hidden',
            zIndex: 0,
          }}
        >
          <div
            className="cv-orb1"
            style={{
              position: 'absolute',
              top: '-20%',
              left: '-10%',
              width: 500,
              height: 500,
              borderRadius: '50%',
              background:
                'radial-gradient(circle, rgba(20,184,166,0.10) 0%, transparent 70%)',
            }}
          />
          <div
            className="cv-orb2"
            style={{
              position: 'absolute',
              bottom: '-15%',
              right: '-5%',
              width: 600,
              height: 600,
              borderRadius: '50%',
              background:
                'radial-gradient(circle, rgba(20,184,166,0.07) 0%, transparent 70%)',
            }}
          />
          <div
            className="cv-orb3"
            style={{
              position: 'absolute',
              top: '40%',
              left: '50%',
              width: 350,
              height: 350,
              borderRadius: '50%',
              background:
                'radial-gradient(circle, rgba(20,184,166,0.05) 0%, transparent 70%)',
            }}
          />
        </div>

        {/* Header */}
        <header
          style={{
            position: 'relative',
            zIndex: 10,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 28px',
            background: 'rgba(6,10,18,0.85)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(20,184,166,0.10)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                border: `1px solid ${TEAL}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-geist-mono, monospace)',
                fontSize: 13,
                color: TEAL,
                letterSpacing: '-0.03em',
              }}
            >
              NI
            </div>
            <span
              style={{
                fontFamily: 'var(--font-geist-mono, monospace)',
                fontSize: 13,
                color: 'rgba(255,255,255,0.45)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              {pageTitle}
            </span>
          </div>

          <BackToRoom />
        </header>

        {/* Scrollable body */}
        <div
          style={{
            position: 'relative',
            zIndex: 5,
            flex: 1,
            overflowY: 'auto',
          }}
        >
          {children}
        </div>
      </div>
    </>
  );
}

/* ── Back to Room button ── */
function BackToRoom() {
  return (
    <Link
      href="/immersive"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '7px 14px',
        borderRadius: 8,
        border: `1px solid rgba(20,184,166,0.30)`,
        background: 'rgba(20,184,166,0.06)',
        color: TEAL,
        textDecoration: 'none',
        fontSize: 13,
        fontFamily: 'var(--font-geist-mono, monospace)',
        transition: 'background 0.15s, border-color 0.15s',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.background =
          'rgba(20,184,166,0.14)';
        (e.currentTarget as HTMLAnchorElement).style.borderColor = TEAL;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.background =
          'rgba(20,184,166,0.06)';
        (e.currentTarget as HTMLAnchorElement).style.borderColor =
          'rgba(20,184,166,0.30)';
      }}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M19 12H5M12 5l-7 7 7 7" />
      </svg>
      Back to Room
    </Link>
  );
}
