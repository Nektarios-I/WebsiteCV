'use client';

/**
 * ExhibitPanel — Side panel overlay showing exhibit details
 *
 * Slides in from the right when an exhibit is active.
 * Reads the exhibit type and ID from the gallery store,
 * looks up the corresponding data, and renders the appropriate layout.
 *
 * Closed via:
 * - X button
 * - Escape key (handled by useGalleryControls)
 * - Clicking the backdrop scrim
 */

import { AnimatePresence, motion } from 'framer-motion';
import type { ReactNode } from 'react';

import { useGalleryStore } from '../../stores/useGalleryStore';
import {
  parseExhibitKey,
  formatDate,
  proficiencyToValue,
  proficiencyToColor,
} from '../../hooks/useExhibitData';
import type {
  ProjectData,
  ExperienceData,
  EducationData,
  SkillCategoryData,
  CertificationData,
} from '../../hooks/useExhibitData';

import cv from '@/data/cv.json';
import projects from '@/data/projects.json';
import skills from '@/data/skills.json';

// ── Data lookup helpers ────────────────────────────────────────────────────

function findProject(id: string): ProjectData | undefined {
  return (projects as unknown as ProjectData[]).find((p) => p.id === id);
}

function findExperience(id: string): ExperienceData | undefined {
  return (cv.experience as unknown as ExperienceData[]).find(
    (e) => e.id === id,
  );
}

function findEducation(id: string): EducationData | undefined {
  return (cv.education as unknown as EducationData[]).find((e) => e.id === id);
}

function findSkillCategory(name: string): SkillCategoryData | undefined {
  return (skills as unknown as SkillCategoryData[]).find(
    (s) => s.category === name,
  );
}

function findCertification(id: string): CertificationData | undefined {
  return (
    (cv as Record<string, unknown>).certifications as
      | CertificationData[]
      | undefined
  )?.find((c) => c.id === id);
}

// ── Main component ─────────────────────────────────────────────────────────

export function ExhibitPanel() {
  const activeExhibit = useGalleryStore((s) => s.activeExhibit);
  const setActiveExhibit = useGalleryStore((s) => s.setActiveExhibit);

  const close = () => setActiveExhibit(null);

  return (
    <AnimatePresence>
      {activeExhibit && (
        <>
          {/* Background scrim — click to close */}
          <motion.div
            key="exhibit-scrim"
            className="fixed inset-0 z-40 bg-black/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />

          {/* Panel — slides in from right */}
          <motion.div
            key="exhibit-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Exhibit details"
            className="fixed top-0 right-0 z-50 h-full w-full max-w-md overflow-y-auto bg-white/95 shadow-2xl backdrop-blur-md"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            {/* Close button */}
            <button
              onClick={close}
              className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700"
              aria-label="Close exhibit panel"
            >
              ✕
            </button>

            {/* Content */}
            <div className="p-6 pt-8">
              <ExhibitContent exhibitKey={activeExhibit} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ── Content router ─────────────────────────────────────────────────────────

function ExhibitContent({ exhibitKey: key }: { exhibitKey: string }) {
  const { type, id } = parseExhibitKey(key);

  switch (type) {
    case 'project': {
      const data = findProject(id);
      return data ? <ProjectContent data={data} /> : <NotFound />;
    }
    case 'experience': {
      const data = findExperience(id);
      return data ? <ExperienceContent data={data} /> : <NotFound />;
    }
    case 'education': {
      const data = findEducation(id);
      return data ? <EducationContent data={data} /> : <NotFound />;
    }
    case 'skill': {
      const data = findSkillCategory(id);
      return data ? <SkillContent data={data} /> : <NotFound />;
    }
    case 'certification': {
      const data = findCertification(id);
      return data ? <CertificationContent data={data} /> : <NotFound />;
    }
    default:
      return <NotFound />;
  }
}

function NotFound() {
  return (
    <p className="py-12 text-center text-gray-400">Exhibit data not found.</p>
  );
}

// ── Project ────────────────────────────────────────────────────────────────

function ProjectContent({ data }: { data: ProjectData }) {
  return (
    <>
      <Badge>{data.category}</Badge>
      <h2 className="mt-2 text-2xl font-bold text-gray-900">{data.title}</h2>

      {data.featured && (
        <span className="mt-1 inline-block rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
          ★ Featured
        </span>
      )}

      <p className="mt-1 text-sm text-gray-500">{data.date}</p>

      <Divider />

      <p className="text-sm leading-relaxed text-gray-700">
        {data.description}
      </p>

      {data.longDescription && (
        <p className="mt-2 text-sm leading-relaxed text-gray-600">
          {data.longDescription}
        </p>
      )}

      {data.technologies.length > 0 && (
        <>
          <Divider />
          <SectionLabel>Technologies</SectionLabel>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {data.technologies.map((tech) => (
              <TechTag key={tech}>{tech}</TechTag>
            ))}
          </div>
        </>
      )}

      {(data.links?.live || data.links?.github) && (
        <>
          <Divider />
          <SectionLabel>Links</SectionLabel>
          <div className="mt-2 flex gap-3">
            {data.links.live && (
              <a
                href={data.links.live}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700"
              >
                🔗 Live Demo
              </a>
            )}
            {data.links.github && (
              <a
                href={data.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                📂 Source Code
              </a>
            )}
          </div>
        </>
      )}
    </>
  );
}

// ── Experience ─────────────────────────────────────────────────────────────

function ExperienceContent({ data }: { data: ExperienceData }) {
  return (
    <>
      <Badge>Experience</Badge>
      <h2 className="mt-2 text-2xl font-bold text-gray-900">{data.role}</h2>
      <p className="mt-1 text-base text-gray-600">{data.company}</p>
      <p className="mt-0.5 text-sm text-gray-400">
        {data.location} · {formatDate(data.startDate)} —{' '}
        {formatDate(data.endDate)}
      </p>

      <Divider />

      <p className="text-sm leading-relaxed text-gray-700">
        {data.description}
      </p>

      {data.highlights.length > 0 && (
        <>
          <Divider />
          <SectionLabel>Key Highlights</SectionLabel>
          <ul className="mt-2 space-y-1.5">
            {data.highlights.map((h, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-600">
                <span className="mt-0.5 text-xs text-teal-500">●</span>
                {h}
              </li>
            ))}
          </ul>
        </>
      )}

      {data.technologies.length > 0 && (
        <>
          <Divider />
          <SectionLabel>Technologies</SectionLabel>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {data.technologies.map((tech) => (
              <TechTag key={tech}>{tech}</TechTag>
            ))}
          </div>
        </>
      )}

      {data.companyUrl && (
        <>
          <Divider />
          <a
            href={data.companyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-teal-600 hover:text-teal-800"
          >
            🔗 Visit {data.company}
          </a>
        </>
      )}
    </>
  );
}

// ── Education ──────────────────────────────────────────────────────────────

function EducationContent({ data }: { data: EducationData }) {
  return (
    <>
      <Badge>Education</Badge>
      <h2 className="mt-2 text-2xl font-bold text-gray-900">
        {data.degree} in {data.field}
      </h2>
      <p className="mt-1 text-base text-gray-600">{data.institution}</p>
      <p className="mt-0.5 text-sm text-gray-400">
        {formatDate(data.startDate)} — {formatDate(data.endDate)}
      </p>

      {data.gpa && (
        <p className="mt-1 text-sm font-medium text-gray-500">
          GPA: {data.gpa}
        </p>
      )}

      <Divider />

      <p className="text-sm leading-relaxed text-gray-700">
        {data.description}
      </p>
    </>
  );
}

// ── Skills ──────────────────────────────────────────────────────────────────

function SkillContent({ data }: { data: SkillCategoryData }) {
  return (
    <>
      <Badge>Skills</Badge>
      <h2 className="mt-2 text-2xl font-bold text-gray-900">{data.category}</h2>
      <p className="mt-1 text-sm text-gray-500">
        {data.skills.length} skill{data.skills.length !== 1 ? 's' : ''}
      </p>

      <Divider />

      <div className="space-y-3">
        {data.skills.map((skill) => (
          <div key={skill.name}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                {skill.name}
              </span>
              <span
                className="text-xs font-medium capitalize"
                style={{ color: proficiencyToColor(skill.proficiency) }}
              >
                {skill.proficiency}
              </span>
            </div>
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${proficiencyToValue(skill.proficiency) * 100}%`,
                  backgroundColor: proficiencyToColor(skill.proficiency),
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// ── Certification ───────────────────────────────────────────────────────

function CertificationContent({ data }: { data: CertificationData }) {
  return (
    <>
      <Badge>Certification</Badge>
      <h2 className="mt-2 text-2xl font-bold text-gray-900">{data.title}</h2>
      <p className="mt-1 text-base text-gray-600">{data.issuer}</p>

      <Divider />

      <p className="text-sm leading-relaxed text-gray-700">
        {data.description}
      </p>
    </>
  );
}

// ── Shared UI primitives ───────────────────────────────────────────────────

function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block rounded-md bg-gray-100 px-2.5 py-1 text-xs font-semibold tracking-wider text-gray-500 uppercase">
      {children}
    </span>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <h3 className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
      {children}
    </h3>
  );
}

function Divider() {
  return <hr className="my-4 border-gray-100" />;
}

function TechTag({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-md bg-teal-50 px-2 py-0.5 text-xs font-medium text-teal-700">
      {children}
    </span>
  );
}
