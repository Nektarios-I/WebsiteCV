/**
 * MDX Components — Custom component mappings for MDX content
 *
 * This file is auto-discovered by @next/mdx (Next.js 16+).
 * It maps HTML elements to custom React components for MDX rendering.
 *
 * @see https://nextjs.org/docs/app/building-your-application/configuring/mdx
 */

import type { MDXComponents } from 'mdx/types';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Override default elements with styled versions
    h1: ({ children }) => (
      <h1 className="mb-4 mt-8 text-3xl font-bold tracking-tight">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="mb-3 mt-6 text-2xl font-semibold tracking-tight">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-2 mt-4 text-xl font-semibold">{children}</h3>
    ),
    p: ({ children }) => (
      <p className="mb-4 leading-7 text-neutral-700 dark:text-neutral-300">
        {children}
      </p>
    ),
    a: ({ href, children }) => (
      <a
        href={href}
        className="font-medium text-accent underline underline-offset-4 transition-colors hover:text-accent/80"
        target={href?.startsWith('http') ? '_blank' : undefined}
        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    ),
    code: ({ children }) => (
      <code className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-sm dark:bg-neutral-800">
        {children}
      </code>
    ),
    pre: ({ children }) => (
      <pre className="mb-4 overflow-x-auto rounded-lg bg-neutral-100 p-4 font-mono text-sm dark:bg-neutral-900">
        {children}
      </pre>
    ),
    ul: ({ children }) => (
      <ul className="mb-4 list-disc pl-6 text-neutral-700 dark:text-neutral-300">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="mb-4 list-decimal pl-6 text-neutral-700 dark:text-neutral-300">
        {children}
      </ol>
    ),
    blockquote: ({ children }) => (
      <blockquote className="mb-4 border-l-4 border-accent pl-4 italic text-neutral-600 dark:text-neutral-400">
        {children}
      </blockquote>
    ),
    hr: () => <hr className="my-8 border-neutral-200 dark:border-neutral-800" />,
    // Spread any overrides passed downstream
    ...components,
  };
}
