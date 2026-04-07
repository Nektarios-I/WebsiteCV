'use client';

import { CvPageShell } from '@/app/_components/CvPageShell';
import skillsData from '@/data/skills.json';

const PROFICIENCY_COLORS: Record<
  string,
  { bg: string; dot: string; label: string }
> = {
  expert: { bg: 'rgba(20,184,166,0.12)', dot: '#14b8a6', label: 'Expert' },
  advanced: { bg: 'rgba(99,102,241,0.12)', dot: '#6366f1', label: 'Advanced' },
  intermediate: {
    bg: 'rgba(251,191,36,0.10)',
    dot: '#fbbf24',
    label: 'Intermediate',
  },
  soft: { bg: 'rgba(168,85,247,0.10)', dot: '#a855f7', label: 'Soft' },
};

const CATEGORY_ICONS: Record<string, string> = {
  language: '{ }',
  web: '</> ',
  domain: '⬡',
  other: '⊞',
  soft: '◎',
};

export function SkillsClient() {
  return (
    <CvPageShell pageTitle="Skills">
      <div
        style={{ maxWidth: 900, margin: '0 auto', padding: '48px 40px 80px' }}
      >
        {/* Page heading */}
        <div style={{ marginBottom: 48 }}>
          <h1
            style={{
              margin: '0 0 10px',
              fontSize: 'clamp(28px, 4vw, 42px)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: 'rgba(255,255,255,0.95)',
            }}
          >
            Skills &amp; Expertise
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: 15,
              color: 'rgba(255,255,255,0.45)',
              lineHeight: 1.6,
            }}
          >
            Technical competencies and soft skills, grouped by proficiency
            level.
          </p>
        </div>

        {/* Skill groups */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
          {skillsData.map((group) => (
            <section key={group.category}>
              {/* Group header */}
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
                  {group.category}
                </h2>
                <div
                  style={{
                    flex: 1,
                    height: 1,
                    background: 'rgba(255,255,255,0.06)',
                  }}
                />
                <span
                  style={{
                    fontSize: 11,
                    fontFamily: 'var(--font-geist-mono, monospace)',
                    color: 'rgba(255,255,255,0.20)',
                  }}
                >
                  {group.skills.length}{' '}
                  {group.skills.length === 1 ? 'skill' : 'skills'}
                </span>
              </div>

              {/* Skill cards grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: 12,
                }}
              >
                {group.skills.map((skill) => {
                  const pKey =
                    skill.category === 'soft' ? 'soft' : skill.proficiency;
                  const colors =
                    PROFICIENCY_COLORS[pKey] ??
                    PROFICIENCY_COLORS['intermediate']!;
                  const icon = CATEGORY_ICONS[skill.category] ?? '○';
                  return (
                    <div
                      key={skill.name}
                      style={{
                        padding: '16px 18px',
                        borderRadius: 10,
                        background: colors.bg,
                        border: `1px solid ${colors.dot}22`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        transition: 'transform 0.15s, box-shadow 0.15s',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLDivElement).style.transform =
                          'translateY(-2px)';
                        (e.currentTarget as HTMLDivElement).style.boxShadow =
                          `0 4px 20px ${colors.dot}18`;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLDivElement).style.transform =
                          '';
                        (e.currentTarget as HTMLDivElement).style.boxShadow =
                          '';
                      }}
                    >
                      {/* Icon */}
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 8,
                          flexShrink: 0,
                          background: `${colors.dot}18`,
                          border: `1px solid ${colors.dot}33`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontFamily: 'var(--font-geist-mono, monospace)',
                          fontSize: 11,
                          color: colors.dot,
                        }}
                      >
                        {icon}
                      </div>

                      {/* Name + proficiency */}
                      <div>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: 'rgba(255,255,255,0.88)',
                            lineHeight: 1.3,
                          }}
                        >
                          {skill.name}
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            marginTop: 4,
                          }}
                        >
                          <span
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              background: colors.dot,
                              flexShrink: 0,
                            }}
                          />
                          <span
                            style={{
                              fontSize: 10,
                              fontFamily: 'var(--font-geist-mono, monospace)',
                              color: colors.dot,
                              letterSpacing: '0.04em',
                            }}
                          >
                            {colors.label}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        {/* Legend */}
        <div
          style={{
            marginTop: 56,
            paddingTop: 28,
            borderTop: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 16,
            alignItems: 'center',
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontFamily: 'var(--font-geist-mono, monospace)',
              color: 'rgba(255,255,255,0.25)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            Proficiency
          </span>
          {(
            [
              ['expert', '#14b8a6'],
              ['advanced', '#6366f1'],
              ['intermediate', '#fbbf24'],
              ['soft', '#a855f7'],
            ] as const
          ).map(([label, color]) => (
            <div
              key={label}
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: color,
                  display: 'inline-block',
                }}
              />
              <span
                style={{
                  fontSize: 11,
                  fontFamily: 'var(--font-geist-mono, monospace)',
                  color: 'rgba(255,255,255,0.40)',
                  textTransform: 'capitalize',
                }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </CvPageShell>
  );
}
