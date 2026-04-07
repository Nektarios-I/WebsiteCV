'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import projectsData from '@/data/projects.json';

type Project = (typeof projectsData)[number];

const CATEGORY_LABELS: Record<string, string> = {
  ml: 'Machine Learning',
  web: 'Web Development',
  other: 'Other',
};

const TEAL = '#14b8a6';
const BG = 'rgb(6, 10, 18)';

export function ProjectsClient() {
  const [active, setActive] = useState(0);
  const [imgError, setImgError] = useState<Record<number, boolean>>({});

  const project: Project | undefined = projectsData[active];

  /* ── Keyboard navigation ── */
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        setActive((i) => (i + 1) % projectsData.length);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        setActive((i) => (i - 1 + projectsData.length) % projectsData.length);
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  if (!project) return null;

  return (
    <>
      {/* Animated background orbs */}
      <style>{`
        @keyframes drift1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(40px, -30px) scale(1.08); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
        }
        @keyframes drift2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          40% { transform: translate(-50px, 30px) scale(1.05); }
          70% { transform: translate(30px, -20px) scale(1.1); }
        }
        @keyframes drift3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(25px, 40px) scale(0.92); }
        }
        .orb1 { animation: drift1 18s ease-in-out infinite; }
        .orb2 { animation: drift2 24s ease-in-out infinite; }
        .orb3 { animation: drift3 30s ease-in-out infinite; }

        html, body { margin: 0; padding: 0; background: ${BG}; }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(20,184,166,0.3); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(20,184,166,0.6); }

        .project-btn:focus-visible {
          outline: 2px solid ${TEAL};
          outline-offset: 2px;
        }
        .project-btn:hover .project-btn-indicator {
          opacity: 1;
          transform: scaleY(1);
        }

        @media (max-width: 768px) {
          .layout-wrapper { flex-direction: column !important; }
          .sidebar { width: 100% !important; height: auto !important; border-right: none !important; border-bottom: 1px solid rgba(20,184,166,0.12) !important; max-height: 200px !important; }
          .main-content { padding: 24px 20px !important; }
          .project-image { height: 180px !important; }
        }
      `}</style>

      {/* Root container */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: BG,
          fontFamily: 'var(--font-geist-sans, system-ui, sans-serif)',
          color: 'rgba(255,255,255,0.87)',
          overflow: 'hidden',
        }}
      >
        {/* Background orbs */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            overflow: 'hidden',
          }}
        >
          <div
            className="orb1"
            style={{
              position: 'absolute',
              top: '-20%',
              left: '-10%',
              width: 500,
              height: 500,
              borderRadius: '50%',
              background: `radial-gradient(circle, rgba(20,184,166,0.10) 0%, transparent 70%)`,
            }}
          />
          <div
            className="orb2"
            style={{
              position: 'absolute',
              bottom: '-15%',
              right: '-5%',
              width: 600,
              height: 600,
              borderRadius: '50%',
              background: `radial-gradient(circle, rgba(20,184,166,0.07) 0%, transparent 70%)`,
            }}
          />
          <div
            className="orb3"
            style={{
              position: 'absolute',
              top: '40%',
              left: '50%',
              width: 350,
              height: 350,
              borderRadius: '50%',
              background: `radial-gradient(circle, rgba(20,184,166,0.05) 0%, transparent 70%)`,
            }}
          />
        </div>

        {/* Top bar */}
        <header
          style={{
            position: 'relative',
            zIndex: 10,
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
            {/* Logo mark */}
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
              Projects
            </span>
          </div>

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
        </header>

        {/* Body — sidebar + main */}
        <div
          className="layout-wrapper"
          style={{
            position: 'relative',
            zIndex: 5,
            display: 'flex',
            height: 'calc(100vh - 61px)',
            overflow: 'hidden',
          }}
        >
          {/* ── Sidebar ── */}
          <aside
            className="sidebar"
            style={{
              width: 250,
              flexShrink: 0,
              height: '100%',
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
              {projectsData.length} Projects
            </p>

            {projectsData.map((p, i) => {
              const isActive = i === active;
              return (
                <button
                  key={p.id}
                  className="project-btn"
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
                    if (!isActive) {
                      (e.currentTarget as HTMLButtonElement).style.background =
                        'rgba(20,184,166,0.05)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLButtonElement).style.background =
                        'transparent';
                    }
                  }}
                  aria-pressed={isActive}
                >
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: isActive ? TEAL : 'rgba(255,255,255,0.75)',
                      marginBottom: 3,
                      transition: 'color 0.15s',
                    }}
                  >
                    {p.title}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      fontFamily: 'var(--font-geist-mono, monospace)',
                      color: 'rgba(255,255,255,0.30)',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {CATEGORY_LABELS[p.category] ?? p.category}
                    {' · '}
                    {typeof p.date === 'number'
                      ? p.date
                      : String(p.date).split('-')[0]}
                  </div>
                </button>
              );
            })}
          </aside>

          {/* ── Main content ── */}
          <main
            className="main-content"
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '40px 48px',
            }}
          >
            <ProjectDetail
              project={project}
              imgError={!!imgError[active]}
              onImgError={() => setImgError((p) => ({ ...p, [active]: true }))}
              onPrev={() =>
                setActive(
                  (i) => (i - 1 + projectsData.length) % projectsData.length,
                )
              }
              onNext={() => setActive((i) => (i + 1) % projectsData.length)}
              activeIndex={active}
              total={projectsData.length}
            />
          </main>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────── Project Detail ─────────────────────────────── */

interface ProjectDetailProps {
  project: Project;
  imgError: boolean;
  onImgError: () => void;
  onPrev: () => void;
  onNext: () => void;
  activeIndex: number;
  total: number;
}

function ProjectDetail({
  project,
  imgError,
  onImgError,
  onPrev,
  onNext,
  activeIndex,
  total,
}: ProjectDetailProps) {
  return (
    <article style={{ maxWidth: 820 }}>
      {/* Category / year badge row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 18,
          flexWrap: 'wrap',
        }}
      >
        <span
          style={{
            display: 'inline-block',
            padding: '3px 10px',
            borderRadius: 4,
            background: 'rgba(20,184,166,0.12)',
            border: `1px solid rgba(20,184,166,0.25)`,
            color: TEAL,
            fontSize: 11,
            fontFamily: 'var(--font-geist-mono, monospace)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          {CATEGORY_LABELS[project.category] ?? project.category}
        </span>
        <span
          style={{
            display: 'inline-block',
            padding: '3px 10px',
            borderRadius: 4,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: 'rgba(255,255,255,0.40)',
            fontSize: 11,
            fontFamily: 'var(--font-geist-mono, monospace)',
            letterSpacing: '0.04em',
          }}
        >
          {String(project.date)}
        </span>
        {project.featured && (
          <span
            style={{
              display: 'inline-block',
              padding: '3px 10px',
              borderRadius: 4,
              background: 'rgba(251,191,36,0.10)',
              border: '1px solid rgba(251,191,36,0.25)',
              color: '#fbbf24',
              fontSize: 11,
              fontFamily: 'var(--font-geist-mono, monospace)',
              letterSpacing: '0.04em',
            }}
          >
            ★ Featured
          </span>
        )}
      </div>

      {/* Title */}
      <h1
        style={{
          margin: '0 0 10px',
          fontSize: 'clamp(24px, 4vw, 38px)',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
          color: 'rgba(255,255,255,0.95)',
        }}
      >
        {project.title}
      </h1>

      {/* Short description */}
      <p
        style={{
          margin: '0 0 28px',
          fontSize: 15,
          color: 'rgba(255,255,255,0.50)',
          lineHeight: 1.6,
        }}
      >
        {project.description}
      </p>

      {/* Project image */}
      <div
        className="project-image"
        style={{
          width: '100%',
          height: 280,
          borderRadius: 12,
          overflow: 'hidden',
          marginBottom: 32,
          border: '1px solid rgba(20,184,166,0.12)',
          background: 'rgba(255,255,255,0.03)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {!imgError ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={project.image}
            alt={project.title}
            onError={onImgError}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 10,
              color: 'rgba(255,255,255,0.20)',
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                background: 'rgba(20,184,166,0.10)',
                border: `1px solid rgba(20,184,166,0.20)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-geist-mono, monospace)',
                fontSize: 20,
                color: 'rgba(20,184,166,0.60)',
                fontWeight: 700,
              }}
            >
              {project.title
                .split(' ')
                .slice(0, 2)
                .map((w) => w[0])
                .join('')
                .toUpperCase()}
            </div>
            <span
              style={{
                fontSize: 12,
                fontFamily: 'var(--font-geist-mono, monospace)',
              }}
            >
              No preview available
            </span>
          </div>
        )}
      </div>

      {/* Long description */}
      <div style={{ marginBottom: 28 }}>
        <h2
          style={{
            margin: '0 0 12px',
            fontSize: 13,
            fontFamily: 'var(--font-geist-mono, monospace)',
            color: 'rgba(255,255,255,0.30)',
            letterSpacing: '0.10em',
            textTransform: 'uppercase',
            fontWeight: 500,
          }}
        >
          Overview
        </h2>
        <p
          style={{
            margin: 0,
            fontSize: 15,
            lineHeight: 1.75,
            color: 'rgba(255,255,255,0.72)',
            maxWidth: 700,
          }}
        >
          {project.longDescription}
        </p>
      </div>

      {/* Tech stack */}
      <div style={{ marginBottom: 32 }}>
        <h2
          style={{
            margin: '0 0 12px',
            fontSize: 13,
            fontFamily: 'var(--font-geist-mono, monospace)',
            color: 'rgba(255,255,255,0.30)',
            letterSpacing: '0.10em',
            textTransform: 'uppercase',
            fontWeight: 500,
          }}
        >
          Technologies
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {project.technologies.map((tech) => (
            <span
              key={tech}
              style={{
                padding: '5px 12px',
                borderRadius: 6,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.10)',
                fontSize: 12,
                fontFamily: 'var(--font-geist-mono, monospace)',
                color: 'rgba(255,255,255,0.65)',
                letterSpacing: '0.02em',
              }}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Links */}
      <div
        style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 48 }}
      >
        {project.links.github && (
          <a
            href={project.links.github}
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle('primary')}
            onMouseEnter={linkHover('primary', true)}
            onMouseLeave={linkHover('primary', false)}
          >
            <GithubIcon />
            View Source
          </a>
        )}
        {project.links.live && (
          <a
            href={project.links.live}
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle('secondary')}
            onMouseEnter={linkHover('secondary', true)}
            onMouseLeave={linkHover('secondary', false)}
          >
            <ExternalIcon />
            Live Demo
          </a>
        )}
      </div>

      {/* Prev / Next navigation */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          paddingTop: 24,
        }}
      >
        <NavButton direction="prev" onClick={onPrev} label="Previous" />
        <span
          style={{
            fontFamily: 'var(--font-geist-mono, monospace)',
            fontSize: 12,
            color: 'rgba(255,255,255,0.25)',
          }}
        >
          {activeIndex + 1} / {total}
        </span>
        <NavButton direction="next" onClick={onNext} label="Next" />
      </div>
    </article>
  );
}

/* ─────────────────────────── Small sub-components ─────────────────────────── */

function NavButton({
  direction,
  onClick,
  label,
}: {
  direction: 'prev' | 'next';
  onClick: () => void;
  label: string;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      aria-label={label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        appearance: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '8px 14px',
        borderRadius: 8,
        border: `1px solid ${hovered ? 'rgba(20,184,166,0.50)' : 'rgba(255,255,255,0.10)'}`,
        background: hovered ? 'rgba(20,184,166,0.08)' : 'transparent',
        color: hovered ? TEAL : 'rgba(255,255,255,0.45)',
        fontSize: 13,
        cursor: 'pointer',
        transition: 'all 0.15s',
      }}
    >
      {direction === 'prev' && (
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
      )}
      {label}
      {direction === 'next' && (
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
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      )}
    </button>
  );
}

function GithubIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  );
}

function ExternalIcon() {
  return (
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
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
      <polyline points="15,3 21,3 21,9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

/* ─────────────────────────── Style helpers ─────────────────────────── */

function linkStyle(variant: 'primary' | 'secondary'): React.CSSProperties {
  const isPrimary = variant === 'primary';
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 7,
    padding: '9px 18px',
    borderRadius: 8,
    textDecoration: 'none',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.15s',
    background: isPrimary ? TEAL : 'transparent',
    color: isPrimary ? '#0a0a0a' : TEAL,
    border: `1px solid ${isPrimary ? TEAL : 'rgba(20,184,166,0.40)'}`,
  };
}

function linkHover(variant: 'primary' | 'secondary', entering: boolean) {
  return (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = e.currentTarget as HTMLAnchorElement;
    if (variant === 'primary') {
      el.style.background = entering ? '#0d9488' : TEAL;
      el.style.borderColor = entering ? '#0d9488' : TEAL;
    } else {
      el.style.background = entering ? 'rgba(20,184,166,0.10)' : 'transparent';
      el.style.borderColor = entering ? TEAL : 'rgba(20,184,166,0.40)';
    }
  };
}
