'use client';

import { useState } from 'react';

import { CvPageShell } from '@/app/_components/CvPageShell';
import cvData from '@/data/cv.json';

const TEAL = '#14b8a6';

type ContactField = {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  copyable?: boolean;
};

export function ContactClient() {
  const { name, title, contact } = cvData;
  const [copied, setCopied] = useState<string | null>(null);

  function copyToClipboard(value: string, key: string) {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    });
  }

  const fields: ContactField[] = [
    {
      icon: <MailIcon />,
      label: 'Email',
      value: contact.email,
      href: `mailto:${contact.email}`,
      copyable: true,
    },
    {
      icon: <PhoneIcon />,
      label: 'Phone',
      value: contact.phone,
      href: `tel:${contact.phone.replace(/\s/g, '')}`,
      copyable: true,
    },
    {
      icon: <LocationIcon />,
      label: 'Location',
      value: contact.location,
    },
    ...(contact.website
      ? [
          {
            icon: <WebIcon />,
            label: 'Website',
            value: contact.website.replace('https://', ''),
            href: contact.website,
          },
        ]
      : []),
    ...(contact.github
      ? [
          {
            icon: <GithubIcon />,
            label: 'GitHub',
            value: contact.github.replace('https://github.com/', '@'),
            href: contact.github,
          },
        ]
      : []),
    ...(contact.linkedin
      ? [
          {
            icon: <LinkedinIcon />,
            label: 'LinkedIn',
            value: contact.linkedin
              .replace('https://linkedin.com/in/', '')
              .replace('https://www.linkedin.com/in/', ''),
            href: contact.linkedin,
          },
        ]
      : []),
  ];

  return (
    <CvPageShell pageTitle="Contact">
      <div
        style={{
          maxWidth: 640,
          margin: '0 auto',
          padding: '60px 40px 80px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            marginBottom: 20,
            background: 'rgba(20,184,166,0.08)',
            border: `1.5px solid ${TEAL}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-geist-mono, monospace)',
            fontSize: 26,
            fontWeight: 700,
            color: TEAL,
          }}
        >
          NI
        </div>

        <h1
          style={{
            margin: '0 0 6px',
            fontSize: 'clamp(26px, 4vw, 36px)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: 'rgba(255,255,255,0.95)',
          }}
        >
          {name}
        </h1>
        <p
          style={{
            margin: '0 0 14px',
            fontSize: 14,
            color: TEAL,
            fontFamily: 'var(--font-geist-mono, monospace)',
            letterSpacing: '0.04em',
          }}
        >
          {title}
        </p>
        <p
          style={{
            margin: '0 0 52px',
            fontSize: 14,
            color: 'rgba(255,255,255,0.40)',
            lineHeight: 1.7,
            maxWidth: 420,
          }}
        >
          Feel free to reach out — I&apos;m always open to discussing new
          opportunities, research collaborations, or just a good conversation
          about tech.
        </p>

        {/* Contact cards */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          {fields.map((field) => (
            <ContactCard
              key={field.label}
              field={field}
              isCopied={copied === field.label}
              onCopy={() =>
                field.copyable && copyToClipboard(field.value, field.label)
              }
            />
          ))}
        </div>

        {/* Footer note */}
        <p
          style={{
            marginTop: 48,
            fontSize: 12,
            fontFamily: 'var(--font-geist-mono, monospace)',
            color: 'rgba(255,255,255,0.20)',
            letterSpacing: '0.04em',
          }}
        >
          Click email or phone to copy to clipboard
        </p>
      </div>
    </CvPageShell>
  );
}

/* ── Contact card ── */

function ContactCard({
  field,
  isCopied,
  onCopy,
}: {
  field: ContactField;
  isCopied: boolean;
  onCopy: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  const inner = (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '16px 20px',
        borderRadius: 12,
        background: hovered
          ? 'rgba(20,184,166,0.06)'
          : 'rgba(255,255,255,0.03)',
        border: `1px solid ${hovered ? 'rgba(20,184,166,0.30)' : 'rgba(255,255,255,0.07)'}`,
        transition: 'background 0.15s, border-color 0.15s',
        cursor: field.href || field.copyable ? 'pointer' : 'default',
        textAlign: 'left',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Icon */}
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 9,
          flexShrink: 0,
          background: hovered
            ? 'rgba(20,184,166,0.12)'
            : 'rgba(255,255,255,0.05)',
          border: `1px solid ${hovered ? 'rgba(20,184,166,0.25)' : 'rgba(255,255,255,0.08)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: hovered ? TEAL : 'rgba(255,255,255,0.45)',
          transition: 'all 0.15s',
        }}
      >
        {field.icon}
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 10,
            fontFamily: 'var(--font-geist-mono, monospace)',
            color: 'rgba(255,255,255,0.30)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: 3,
          }}
        >
          {field.label}
        </div>
        <div
          style={{
            fontSize: 14,
            color: hovered
              ? 'rgba(255,255,255,0.95)'
              : 'rgba(255,255,255,0.75)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            transition: 'color 0.15s',
          }}
        >
          {field.value}
        </div>
      </div>

      {/* Action indicator */}
      {(field.href || field.copyable) && (
        <div
          style={{
            flexShrink: 0,
            fontSize: 12,
            color: TEAL,
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.15s',
            fontFamily: 'var(--font-geist-mono, monospace)',
          }}
        >
          {isCopied ? '✓ Copied' : field.copyable ? 'Copy' : '↗'}
        </div>
      )}
    </div>
  );

  if (field.copyable) {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={onCopy}
        onKeyDown={(e) => e.key === 'Enter' && onCopy()}
      >
        {inner}
      </div>
    );
  }

  if (field.href) {
    return (
      <a
        href={field.href}
        target={
          field.href.startsWith('mailto') || field.href.startsWith('tel')
            ? '_self'
            : '_blank'
        }
        rel="noopener noreferrer"
        style={{ textDecoration: 'none', display: 'block' }}
      >
        {inner}
      </a>
    );
  }

  return <div>{inner}</div>;
}

/* ── SVG icons ── */

function MailIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}
function LocationIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
function WebIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}
function GithubIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  );
}
function LinkedinIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}
