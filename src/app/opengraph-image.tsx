/**
 * Dynamic OG Image Generator
 *
 * Creates Open Graph images for social media sharing.
 * Uses Next.js ImageResponse API.
 */

import { ImageResponse } from 'next/og';

import { SITE } from '@/lib/constants';
import cv from '@/data/cv.json';

export const runtime = 'edge';

export const alt = `${cv.name} - ${cv.title}`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0a0a0a',
        backgroundImage:
          'radial-gradient(circle at 25% 25%, #14b8a620 0%, transparent 50%), radial-gradient(circle at 75% 75%, #14b8a610 0%, transparent 50%)',
      }}
    >
      {/* Accent border top */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #14b8a6, #5eead4)',
        }}
      />

      {/* Content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
        }}
      >
        {/* Name */}
        <h1
          style={{
            fontSize: '72px',
            fontWeight: 700,
            color: '#ffffff',
            margin: 0,
            lineHeight: 1.1,
          }}
        >
          {cv.name}
        </h1>

        {/* Title */}
        <p
          style={{
            fontSize: '32px',
            color: '#14b8a6',
            margin: '16px 0 0 0',
            fontWeight: 500,
          }}
        >
          {cv.title}
        </p>

        {/* Tagline */}
        <p
          style={{
            fontSize: '20px',
            color: '#a3a3a3',
            margin: '24px 0 0 0',
            maxWidth: '600px',
            textAlign: 'center',
          }}
        >
          {SITE.DESCRIPTION}
        </p>
      </div>

      {/* URL footer */}
      <div
        style={{
          position: 'absolute',
          bottom: '40px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span
          style={{
            fontSize: '18px',
            color: '#525252',
          }}
        >
          {SITE.URL.replace('https://', '')}
        </span>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
