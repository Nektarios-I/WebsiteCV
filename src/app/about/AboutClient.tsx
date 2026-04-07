'use client';

import { CvPageShell } from '@/app/_components/CvPageShell';
import cvData from '@/data/cv.json';

const TEAL = '#14b8a6';

export function AboutClient() {
  const { name, title, bio, education, certifications } = cvData;

  return (
    <CvPageShell pageTitle="About">
      <div
        style={{ maxWidth: 800, margin: '0 auto', padding: '48px 40px 80px' }}
      >
        {/* ── Hero ── */}
        <section
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 28,
            marginBottom: 56,
            flexWrap: 'wrap',
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 20,
              flexShrink: 0,
              background: 'rgba(20,184,166,0.10)',
              border: `1.5px solid ${TEAL}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-geist-mono, monospace)',
              fontSize: 24,
              fontWeight: 700,
              color: TEAL,
              letterSpacing: '-0.03em',
            }}
          >
            NI
          </div>

          <div style={{ flex: 1, minWidth: 200 }}>
            <h1
              style={{
                margin: '0 0 4px',
                fontSize: 'clamp(26px, 4vw, 38px)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: 'rgba(255,255,255,0.95)',
              }}
            >
              {name}
            </h1>
            <p
              style={{
                margin: '0 0 16px',
                fontSize: 14,
                fontFamily: 'var(--font-geist-mono, monospace)',
                color: TEAL,
                letterSpacing: '0.04em',
              }}
            >
              {title}
            </p>
            <p
              style={{
                margin: 0,
                fontSize: 15,
                lineHeight: 1.75,
                color: 'rgba(255,255,255,0.68)',
                maxWidth: 620,
              }}
            >
              {bio}
            </p>
          </div>
        </section>

        {/* ── Education ── */}
        <Section label="Education">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {education.map((edu) => {
              const start = edu.startDate.split('-')[0];
              const end =
                edu.endDate === 'Present'
                  ? 'Present'
                  : edu.endDate.split('-')[0];
              return (
                <div
                  key={edu.id}
                  style={{
                    padding: '20px 24px',
                    borderRadius: 12,
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    transition: 'border-color 0.15s, background 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor =
                      'rgba(20,184,166,0.25)';
                    (e.currentTarget as HTMLDivElement).style.background =
                      'rgba(20,184,166,0.04)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor =
                      'rgba(255,255,255,0.07)';
                    (e.currentTarget as HTMLDivElement).style.background =
                      'rgba(255,255,255,0.03)';
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      flexWrap: 'wrap',
                      gap: 8,
                      marginBottom: 6,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 15,
                          fontWeight: 600,
                          color: 'rgba(255,255,255,0.92)',
                          marginBottom: 2,
                        }}
                      >
                        {edu.institution}
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          color: TEAL,
                          fontFamily: 'var(--font-geist-mono, monospace)',
                        }}
                      >
                        {edu.degree} · {edu.field}
                      </div>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                        gap: 4,
                      }}
                    >
                      <DateBadge>
                        {start} – {end}
                      </DateBadge>
                      <GpaBadge>{edu.gpa}</GpaBadge>
                    </div>
                  </div>
                  <p
                    style={{
                      margin: '10px 0 0',
                      fontSize: 13,
                      color: 'rgba(255,255,255,0.50)',
                      lineHeight: 1.65,
                    }}
                  >
                    {edu.description}
                  </p>
                </div>
              );
            })}
          </div>
        </Section>

        {/* ── Certifications ── */}
        <Section label="Certifications">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {certifications.map((cert) => (
              <div
                key={cert.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 14,
                  padding: '16px 20px',
                  borderRadius: 10,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  transition: 'border-color 0.15s, background 0.15s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor =
                    'rgba(20,184,166,0.25)';
                  (e.currentTarget as HTMLDivElement).style.background =
                    'rgba(20,184,166,0.04)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor =
                    'rgba(255,255,255,0.07)';
                  (e.currentTarget as HTMLDivElement).style.background =
                    'rgba(255,255,255,0.03)';
                }}
              >
                {/* Icon circle */}
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    flexShrink: 0,
                    background: 'rgba(20,184,166,0.08)',
                    border: `1px solid rgba(20,184,166,0.20)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: TEAL,
                    fontSize: 14,
                  }}
                >
                  ✦
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: 'rgba(255,255,255,0.88)',
                      marginBottom: 3,
                    }}
                  >
                    {cert.title}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: 'rgba(255,255,255,0.40)',
                      marginBottom: 5,
                      fontFamily: 'var(--font-geist-mono, monospace)',
                    }}
                  >
                    {cert.issuer}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: 'rgba(255,255,255,0.55)',
                      lineHeight: 1.55,
                    }}
                  >
                    {cert.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </CvPageShell>
  );
}

/* ── shared micro-components ── */

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section style={{ marginBottom: 48 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 20,
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: 12,
            fontFamily: 'var(--font-geist-mono, monospace)',
            color: 'rgba(255,255,255,0.30)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            fontWeight: 500,
          }}
        >
          {label}
        </h2>
        <div
          style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }}
        />
      </div>
      {children}
    </section>
  );
}

function DateBadge({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        padding: '2px 8px',
        borderRadius: 4,
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        fontSize: 10,
        fontFamily: 'var(--font-geist-mono, monospace)',
        color: 'rgba(255,255,255,0.35)',
        letterSpacing: '0.04em',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  );
}

function GpaBadge({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        padding: '2px 8px',
        borderRadius: 4,
        background: 'rgba(20,184,166,0.08)',
        border: '1px solid rgba(20,184,166,0.20)',
        fontSize: 10,
        fontFamily: 'var(--font-geist-mono, monospace)',
        color: '#14b8a6',
        letterSpacing: '0.04em',
        whiteSpace: 'nowrap',
      }}
    >
      GPA {children}
    </span>
  );
}
