'use client';

/**
 * ScreenReaderContent — Hidden accessible content for Mode C
 *
 * Provides a text-only representation of gallery exhibits
 * for screen reader users. Visually hidden but fully accessible
 * via assistive technology.
 *
 * Also provides keyboard-navigable room links for users who
 * cannot interact with the 3D canvas.
 */

import { useExhibitData, formatDate } from '../../hooks/useExhibitData';
import { ROOM_NAMES } from '../../lib/constants';
import type { RoomId } from '../../lib/constants';
import { useGalleryStore } from '../../stores/useGalleryStore';
import { useRoomTransition } from '../../hooks/useRoomTransition';

const ROOM_IDS: RoomId[] = ['lobby', 'projects', 'bio', 'skills', 'playground'];

export function ScreenReaderContent() {
  const { projects, experience, education, skills, certifications, personal } =
    useExhibitData();
  const currentRoom = useGalleryStore((s) => s.currentRoom);
  const { transitionTo } = useRoomTransition();

  return (
    <div className="sr-only" aria-label="Gallery content (text version)">
      {/* Keyboard room navigation */}
      <nav aria-label="Gallery rooms">
        <h2>Gallery Rooms</h2>
        <p>Currently in: {ROOM_NAMES[currentRoom]}</p>
        <ul>
          {ROOM_IDS.map((id) => (
            <li key={id}>
              <button
                onClick={() => transitionTo(id)}
                aria-current={currentRoom === id ? 'location' : undefined}
              >
                Go to {ROOM_NAMES[id]}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* About */}
      <section aria-label="About">
        <h2>{personal.name}</h2>
        <p>{personal.title}</p>
        <p>{personal.bio}</p>
      </section>

      {/* Projects */}
      <section aria-label="Projects">
        <h2>Projects ({projects.length})</h2>
        {projects.map((p) => (
          <article key={p.id}>
            <h3>{p.title}</h3>
            <p>Category: {p.category}</p>
            <p>{p.description}</p>
            <p>Technologies: {p.technologies.join(', ')}</p>
            {p.links?.live && <a href={p.links.live}>Live demo</a>}
            {p.links?.github && <a href={p.links.github}>Source code</a>}
          </article>
        ))}
      </section>

      {/* Experience */}
      <section aria-label="Experience">
        <h2>Experience ({experience.length})</h2>
        {experience.map((e) => (
          <article key={e.id}>
            <h3>
              {e.role} at {e.company}
            </h3>
            <p>
              {formatDate(e.startDate)} — {formatDate(e.endDate)}
            </p>
            <p>{e.description}</p>
            {e.highlights.length > 0 && (
              <ul>
                {e.highlights.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </section>

      {/* Education */}
      <section aria-label="Education">
        <h2>Education ({education.length})</h2>
        {education.map((e) => (
          <article key={e.id}>
            <h3>
              {e.degree} in {e.field}
            </h3>
            <p>{e.institution}</p>
            <p>
              {formatDate(e.startDate)} — {formatDate(e.endDate)}
            </p>
          </article>
        ))}
      </section>

      {/* Skills */}
      <section aria-label="Skills">
        <h2>Skills ({skills.length} categories)</h2>
        {skills.map((cat) => (
          <div key={cat.category}>
            <h3>{cat.category}</h3>
            <ul>
              {cat.skills.map((s) => (
                <li key={s.name}>
                  {s.name} — {s.proficiency}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* Certifications */}
      <section aria-label="Certifications">
        <h2>Certifications & Achievements ({certifications.length})</h2>
        {certifications.map((c) => (
          <article key={c.id}>
            <h3>{c.title}</h3>
            <p>{c.issuer}</p>
            <p>{c.description}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
