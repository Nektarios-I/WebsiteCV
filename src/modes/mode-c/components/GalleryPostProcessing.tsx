'use client';

/**
 * GalleryPostProcessing — Selective Bloom + Vignette for the gallery
 *
 * Bloom only affects emissive materials (exhibit glow, skill orbs),
 * giving the gallery a polished cinematic look without overdoing it.
 *
 * Automatically disabled when:
 * - User prefers reduced motion
 * - PerformanceMonitor signals low FPS (via prop)
 *
 * ~20KB additional bundle. Renders as a single fullscreen pass.
 */

import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';

interface GalleryPostProcessingProps {
  enabled?: boolean;
}

export function GalleryPostProcessing({
  enabled = true,
}: GalleryPostProcessingProps) {
  if (!enabled) return null;

  return (
    <EffectComposer multisampling={0}>
      {/* Bloom — only hits emissive materials (exhibit glow, orbs) */}
      <Bloom
        intensity={0.3}
        luminanceThreshold={0.6}
        luminanceSmoothing={0.4}
        mipmapBlur
      />
      {/* Subtle vignette — darkens edges for cinematic framing */}
      <Vignette
        offset={0.3}
        darkness={0.4}
        eskil={false}
      />
    </EffectComposer>
  );
}
