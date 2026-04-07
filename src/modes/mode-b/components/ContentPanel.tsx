'use client';

/**
 * ContentPanel.tsx — In-room terminal panel for CV content
 *
 * Uses position:fixed inset-0 — same as the Loader — which creates a
 * viewport-level stacking context that sits ABOVE the GPU-composited WebGL
 * canvas layer. position:absolute would stay within the same compositor layer
 * as the canvas and get buried behind it.
 *
 * NO backdrop-filter anywhere — filter CSS over the WebGL <canvas> forces GPU
 * read-backs that stall useProgress at 0 %.
 *
 * Close: click ×, press Q, or press Escape.
 */

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import cv from '@/data/cv.json';
import projects from '@/data/projects.json';
import skills from '@/data/skills.json';

import type { ContentSection } from '../store/useModeBStore';
import { useModeBStore } from '../store/useModeBStore';

interface ContentPanelProps {
  className?: string;
}

/** Monospace terminal header label shown in the title bar */
function sectionLabel(s: ContentSection): string {
  switch (s) {
    case 'about': return '> about.nektarios';
    case 'experience': return '> experience.json';
    case 'projects': return '> projects.list';
    case 'skills': return '> skills.map';
    case 'contact': return '> contact.txt';
    default: return '>';
  }
}

export function ContentPanel({ className = '' }: ContentPanelProps) {
  const { selectedContent, resetView } = useModeBStore();

  // Q / Escape → close panel
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'q' || e.key === 'Q') resetView();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [resetView]);

  return (
    /*
     * position:fixed inset-0 — creates a viewport-level stacking context.
     * CRITICAL: The WebGL <canvas> is GPU-composited and renders ABOVE any
     * position:absolute sibling regardless of z-index. position:fixed escapes
     * that by creating its own compositor layer at the viewport root, exactly
     * like the Loader does. No backdropFilter → no GPU read-back stall.
     */
    <div className="pointer-events-none fixed inset-0 z-[200]">
      <AnimatePresence>
        {selectedContent && (
          <motion.div
            key={selectedContent}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`pointer-events-auto absolute right-4 top-1/2 w-full max-w-md -translate-y-1/2 overflow-hidden rounded-lg shadow-[0_0_60px_rgba(0,0,0,0.8)] ${className}`}
            style={{ background: 'rgb(6,10,18)', border: '1px solid rgba(20,184,166,0.22)', maxHeight: '82vh' }}
          >
            {/* ── Terminal title bar ─────────────────────── */}
            <div
              className="flex shrink-0 items-center justify-between px-4 py-2.5"
              style={{ borderBottom: '1px solid rgba(20,184,166,0.15)', background: 'rgba(20,184,166,0.04)' }}
            >
              <span className="font-mono text-xs" style={{ color: 'rgba(20,184,166,0.8)', letterSpacing: '0.04em' }}>
                {sectionLabel(selectedContent)}
              </span>
              <button
                onClick={resetView}
                className="flex h-5 w-5 items-center justify-center rounded font-mono text-base leading-none transition-colors"
                style={{ color: 'rgba(148,163,184,0.45)' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(239,68,68,0.85)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(148,163,184,0.45)'; }}
                aria-label="Close panel (Q / Esc)"
              >
                ×
              </button>
            </div>

            {/* ── Scrollable content ─────────────────────── */}
            <div className="overflow-y-auto p-5" style={{ maxHeight: 'calc(82vh - 44px)' }}>
              <PanelContent section={selectedContent} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PanelContent({ section }: { section: ContentSection }) {
  switch (section) {
    case 'about':
      return <AboutContent />;
    case 'experience':
      return <ExperienceContent />;
    case 'projects':
      return <ProjectsContent />;
    case 'skills':
      return <SkillsContent />;
    case 'contact':
      return <ContactContent />;
    default:
      return null;
  }
}

function AboutContent() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">About Me</h2>
      <p className="leading-relaxed text-white/70">{cv.bio}</p>
      <div className="flex flex-wrap gap-2 pt-2">
        <span className="rounded-full bg-accent/20 px-3 py-1 text-xs text-accent">
          {cv.title}
        </span>
      </div>
    </div>
  );
}

function ExperienceContent() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">Experience</h2>
      <div className="space-y-6">
        {cv.experience.map((exp) => (
          <div key={exp.id} className="border-l-2 border-accent/30 pl-4">
            <h3 className="font-semibold text-white">{exp.role}</h3>
            <p className="text-sm text-accent">{exp.company}</p>
            <p className="mt-1 text-xs text-white/50">
              {exp.startDate} — {exp.endDate}
            </p>
            <ul className="mt-2 space-y-1">
              {exp.highlights.slice(0, 2).map((h, i) => (
                <li key={i} className="text-sm text-white/60">
                  • {h}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectsContent() {
  const [idx, setIdx] = useState(0);
  const [imgErr, setImgErr] = useState(false);
  const total = projects.length;
  const p = projects[idx]!;

  // Reset image error flag when project changes
  useEffect(() => setImgErr(false), [idx]);

  const prev = () => setIdx((i) => (i - 1 + total) % total);
  const next = () => setIdx((i) => (i + 1) % total);

  // Category color accent
  const catColor: Record<string, string> = {
    ml: 'rgba(167,139,250,0.9)',  // purple for ML
    web: 'rgba(20,184,166,0.9)',   // teal for web
    other: 'rgba(148,163,184,0.9)', // slate for other
  };
  const accent = catColor[(p as { category?: string }).category ?? 'other'] ?? catColor.other;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      {/* ── Image area ──────────────────────────── */}
      <div
        style={{
          width: '100%',
          height: '160px',
          borderRadius: '6px',
          overflow: 'hidden',
          marginBottom: '14px',
          background: 'rgba(20,184,166,0.06)',
          border: '1px solid rgba(20,184,166,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          flexShrink: 0,
        }}
      >
        {!imgErr ? (
          <img
            key={p.id}
            src={(p as { image?: string }).image}
            alt={p.title}
            onError={() => setImgErr(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          /* Fallback: coloured initials block */
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '36px', fontWeight: 700, color: accent, fontFamily: 'monospace', letterSpacing: '-2px' }}>
              {p.title.split(' ').slice(0, 2).map((w) => w[0]).join('')}
            </span>
            <span style={{ fontSize: '10px', color: 'rgba(148,163,184,0.6)', fontFamily: 'monospace' }}>
              project/{p.id}
            </span>
          </div>
        )}
        {/* Category badge */}
        <span
          style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            background: 'rgba(6,10,18,0.88)',
            border: `1px solid ${accent}`,
            color: accent,
            fontSize: '9px',
            fontFamily: 'monospace',
            padding: '2px 7px',
            borderRadius: '4px',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          {(p as { category?: string }).category ?? 'project'}
        </span>
        {/* Year badge */}
        <span
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            background: 'rgba(6,10,18,0.88)',
            color: 'rgba(148,163,184,0.7)',
            fontSize: '9px',
            fontFamily: 'monospace',
            padding: '2px 7px',
            borderRadius: '4px',
          }}
        >
          {(p as { date?: string }).date ?? ''}
        </span>
      </div>

      {/* ── Title ───────────────────────────────── */}
      <h3
        style={{
          margin: '0 0 8px',
          fontSize: '15px',
          fontWeight: 700,
          color: '#f1f5f9',
          lineHeight: 1.3,
        }}
      >
        {p.title}
      </h3>

      {/* ── Long description ────────────────────── */}
      <p
        style={{
          margin: '0 0 12px',
          fontSize: '12px',
          color: 'rgba(148,163,184,0.85)',
          lineHeight: 1.65,
        }}
      >
        {(p as { longDescription?: string }).longDescription ?? p.description}
      </p>

      {/* ── Tech stack ──────────────────────────── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '14px' }}>
        {p.technologies.map((t) => (
          <span
            key={t}
            style={{
              background: 'rgba(20,184,166,0.08)',
              border: '1px solid rgba(20,184,166,0.2)',
              color: 'rgba(20,184,166,0.85)',
              fontSize: '10px',
              fontFamily: 'monospace',
              padding: '2px 8px',
              borderRadius: '4px',
            }}
          >
            {t}
          </span>
        ))}
      </div>

      {/* ── Links ───────────────────────────────── */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {(p.links as { github?: string }).github && (
          <a
            href={(p.links as { github?: string }).github}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '11px',
              fontFamily: 'monospace',
              color: 'rgba(20,184,166,0.85)',
              border: '1px solid rgba(20,184,166,0.25)',
              padding: '4px 10px',
              borderRadius: '5px',
              textDecoration: 'none',
              background: 'rgba(20,184,166,0.06)',
            }}
          >
            ⌘ GitHub
          </a>
        )}
        {(p.links as { live?: string }).live && (
          <a
            href={(p.links as { live?: string }).live}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '11px',
              fontFamily: 'monospace',
              color: 'rgba(167,139,250,0.85)',
              border: '1px solid rgba(167,139,250,0.25)',
              padding: '4px 10px',
              borderRadius: '5px',
              textDecoration: 'none',
              background: 'rgba(167,139,250,0.06)',
            }}
          >
            ↗ Live Site
          </a>
        )}
      </div>

      {/* ── Prev / Next navigation ──────────────── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '12px',
          borderTop: '1px solid rgba(20,184,166,0.12)',
        }}
      >
        <button
          onClick={prev}
          style={{
            background: 'rgba(20,184,166,0.08)',
            border: '1px solid rgba(20,184,166,0.25)',
            color: 'rgba(20,184,166,0.85)',
            padding: '6px 14px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '12px',
            fontFamily: 'monospace',
          }}
        >
          ← Prev
        </button>
        <span
          style={{
            fontFamily: 'monospace',
            fontSize: '11px',
            color: 'rgba(148,163,184,0.55)',
          }}
        >
          {idx + 1} / {total}
        </span>
        <button
          onClick={next}
          style={{
            background: 'rgba(20,184,166,0.08)',
            border: '1px solid rgba(20,184,166,0.25)',
            color: 'rgba(20,184,166,0.85)',
            padding: '6px 14px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '12px',
            fontFamily: 'monospace',
          }}
        >
          Next →
        </button>
      </div>
    </div>
  );
}

function SkillsContent() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">Skills</h2>
      <div className="space-y-4">
        {skills.map((category) => (
          <div key={category.category}>
            <h3 className="mb-2 text-sm font-medium text-accent">
              {category.category}
            </h3>
            <div className="flex flex-wrap gap-2">
              {category.skills.map((skill) => (
                <span
                  key={skill.name}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/80"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactContent() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">Get in Touch</h2>
      <p className="text-white/70">
        Interested in working together? Feel free to reach out!
      </p>
      <div className="space-y-3 pt-2">
        <a
          href={`mailto:${cv.contact.email}`}
          className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3 text-white/80 transition-colors hover:border-accent/50 hover:bg-accent/10"
        >
          <span className="text-accent">✉</span>
          <span className="text-sm">{cv.contact.email}</span>
        </a>
        {cv.contact.linkedin && (
          <a
            href={cv.contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3 text-white/80 transition-colors hover:border-accent/50 hover:bg-accent/10"
          >
            <span className="text-accent">in</span>
            <span className="text-sm">LinkedIn Profile</span>
          </a>
        )}
        {cv.contact.github && (
          <a
            href={cv.contact.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3 text-white/80 transition-colors hover:border-accent/50 hover:bg-accent/10"
          >
            <span className="text-accent">⌘</span>
            <span className="text-sm">GitHub Profile</span>
          </a>
        )}
        <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3">
          <span className="text-accent">☎</span>
          <span className="text-sm text-white/80">{cv.contact.phone}</span>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3">
          <span className="text-accent">⌂</span>
          <span className="text-sm text-white/80">{cv.contact.location}</span>
        </div>
      </div>
    </div>
  );
}
