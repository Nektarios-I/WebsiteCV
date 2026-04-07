/**
 * JsonLd — Structured data component for SEO
 *
 * Outputs JSON-LD structured data in a script tag.
 * Supports Person and WebSite schemas.
 */

import { SITE } from '@/lib/constants';
import cv from '@/data/cv.json';

interface JsonLdProps {
  type?: 'WebSite' | 'Person' | 'ProfilePage';
}

export function JsonLd({ type = 'WebSite' }: JsonLdProps) {
  const baseData = {
    '@context': 'https://schema.org',
  };

  let structuredData;

  switch (type) {
    case 'Person':
      structuredData = {
        ...baseData,
        '@type': 'Person',
        name: cv.name,
        jobTitle: cv.title,
        description: cv.bio,
        email: cv.contact.email,
        url: SITE.URL,
        sameAs: [
          cv.contact.github,
          cv.contact.linkedin,
          cv.contact.website,
        ].filter(Boolean),
        knowsAbout: cv.experience.flatMap((exp) => exp.technologies),
      };
      break;

    case 'ProfilePage':
      structuredData = {
        ...baseData,
        '@type': 'ProfilePage',
        mainEntity: {
          '@type': 'Person',
          name: cv.name,
          jobTitle: cv.title,
          description: cv.bio,
          url: SITE.URL,
        },
      };
      break;

    case 'WebSite':
    default:
      structuredData = {
        ...baseData,
        '@type': 'WebSite',
        name: SITE.NAME,
        description: SITE.DESCRIPTION,
        url: SITE.URL,
        author: {
          '@type': 'Person',
          name: cv.name,
        },
      };
      break;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 0),
      }}
    />
  );
}
