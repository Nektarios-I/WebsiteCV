'use client';

import { useState } from 'react';

import { CvPageShell } from '@/app/_components/CvPageShell';
import cvData from '@/data/cv.json';

const TEAL = '#14b8a6';

export function ExperienceClient() {
  const { experience } = cvData;
  const [active, setActive] = useState(0);
  const entry = experience[active];

  return (
    <CvPageShell pageTitle="Experience">
      <div
        style={{
          display: 'flex',
          height: 'calc(100vh - 61px)',
          overflow: 'hidden',
        }}
      >
        {/* ── Sidebar ── */}
        <aside
          style={{
            width: 240,
            flexShrink: 0,
            overflowY: 'auto',
            borderRight: '1px solid rgba(20,184,166,0.10)',
            padding: '20px 0',
            background: 'rgba(6,10,18,0.60)',
          }}
        >
          <p
            style={{
              margin: '0 16px 12px',
              fontSize: 10,
              fontFamily: 'var(--font-geist-mono, monospace)',
              color: 'rgba(255,255,255,0.30)',
              letterSpacing: '0.10em',
              textTransform: 'uppercase',
            }}
          >
            {experience.length} Positions
          </p>

          {experience.map((exp, i) => {
            const isActive = i === active;
            return (
              <button
                key={exp.id}
                onClick={() => setActive(i)}
                style={{
                  appearance: 'none',
                  background: isActive
                    ? 'rgba(20,184,166,0.10)'
                    : 'transparent',
                  border: 'none',
                  borderLeft: `3px solid ${isActive ? TEAL : 'transparent'}`,
                  width: '100%',
                  textAlign: 'left',
                  padding: '12px 16px',
                  cursor: 'pointer',
                  transition: 'background 0.15s, border-color 0.15s',
                }}
                onMouseEnter={(e) => {
                  if (!isActive)
                    (e.currentTarget as HTMLButtonElement).style.background =
                      'rgba(20,184,166,0.05)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive)
                    (e.currentTarget as HTMLButtonElement).style.background =
                      'transparent';
                }}
                aria-pressed={isActive}
              >
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: isActive ? TEAL : 'rgba(255,255,255,0.75)',
                    marginBottom: 2,
                  }}
                >
                  {exp.role}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: 'rgba(255,255,255,0.40)',
                    fontFamily: 'var(--font-geist-mono, monospace)',
                  }}
                >
                  {exp.company}
                </div>
              </button>
            );
          })}
        </aside>

        {/* ── Main ── */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '40px 48px' }}>
          {entry && <ExperienceEntry entry={entry} />}
        </main>
      </div>
    </CvPageShell>
  );
}

/* ── Entry detail ── */

type Experience = (typeof cvData.experience)[number];

function ExperienceEntry({ entry }: { entry: Experience }) {
  const start = entry.startDate.replace('-', ' · ').replace(/^(\d{4})$/, '$1');
  const end =
    entry.endDate === 'Present' ? 'Present' : entry.endDate.replace('-', ' · ');

  return (
    <article style={{ maxWidth: 700 }}>
      {/* Date badge */}
      <div style={{ marginBottom: 16 }}>
        <span
          style={{
            padding: '3px 10px',
            borderRadius: 4,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            fontSize: 11,
            fontFamily: 'var(--font-geist-mono, monospace)',
            color: 'rgba(255,255,255,0.40)',
            letterSpacing: '0.04em',
          }}
        >
          {start} – {end}
        </span>
        {entry.location && (
          <span
            style={{
              marginLeft: 8,
              padding: '3px 10px',
              borderRadius: 4,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              fontSize: 11,
              fontFamily: 'var(--font-geist-mono, monospace)',
              color: 'rgba(255,255,255,0.28)',
              letterSpacing: '0.04em',
            }}
          >
            📍 {entry.location}
          </span>
        )}
      </div>

      {/* Role + company */}
      <h1
        style={{
          margin: '0 0 6px',
          fontSize: 'clamp(22px, 3.5vw, 32px)',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          color: 'rgba(255,255,255,0.95)',
        }}
      >
        {entry.role}
      </h1>
      {entry.companyUrl ? (
        <a
          href={entry.companyUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: 15,
            color: TEAL,
            textDecoration: 'none',
            fontFamily: 'var(--font-geist-mono, monospace)',
            marginBottom: 20,
            display: 'inline-block',
          }}
        >
          {entry.company} ↗
        </a>
      ) : (
        <p
          style={{
            margin: '0 0 20px',
            fontSize: 15,
            color: TEAL,
            fontFamily: 'var(--font-geist-mono, monospace)',
          }}
        >
          {entry.company}
        </p>
      )}

      {/* Description */}
      <p
        style={{
          margin: '0 0 28px',
          fontSize: 15,
          color: 'rgba(255,255,255,0.68)',
          lineHeight: 1.75,
        }}
      >
        {entry.description}
      </p>

      {/* Highlights */}
      {entry.highlights.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <SectionLabel>Key Highlights</SectionLabel>
          <ul
            style={{
              margin: 0,
              paddingLeft: 0,
              listStyle: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            {entry.highlights.map((h, i) => (
              <li
                key={i}
                style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}
              >
                <span
                  style={{
                    color: TEAL,
                    fontSize: 16,
                    lineHeight: '22px',
                    flexShrink: 0,
                  }}
                >
                  ›
                </span>
                <span
                  style={{
                    fontSize: 14,
                    color: 'rgba(255,255,255,0.70)',
                    lineHeight: 1.65,
                  }}
                >
                  {h}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Technologies */}
      {entry.technologies.length > 0 && (
        <div>
          <SectionLabel>Technologies</SectionLabel>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {entry.technologies.map((t) => (
              <span
                key={t}
                style={{
                  padding: '5px 12px',
                  borderRadius: 6,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  fontSize: 12,
                  fontFamily: 'var(--font-geist-mono, monospace)',
                  color: 'rgba(255,255,255,0.65)',
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        margin: '0 0 12px',
        fontSize: 11,
        fontFamily: 'var(--font-geist-mono, monospace)',
        color: 'rgba(255,255,255,0.30)',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        fontWeight: 500,
      }}
    >
      {children}
    </h2>
  );
}
