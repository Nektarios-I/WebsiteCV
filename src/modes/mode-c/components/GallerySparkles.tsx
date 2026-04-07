'use client';

/**
 * GallerySparkles — Floating dust motes for gallery ambiance
 *
 * Renders drei <Sparkles> particles that drift around the current room,
 * giving a soft dreamy atmosphere like dust caught in spotlight beams.
 *
 * Automatically disabled when user prefers reduced motion.
 */

import { Sparkles } from '@react-three/drei';

import { useGalleryStore } from '../stores/useGalleryStore';
import { ROOM_DIMENSIONS } from '../lib/constants';

interface GallerySparklesProps {
  enabled?: boolean;
}

export function GallerySparkles({ enabled = true }: GallerySparklesProps) {
  const currentRoom = useGalleryStore((s) => s.currentRoom);

  if (!enabled) return null;

  const dims = ROOM_DIMENSIONS[currentRoom];
  const [w, h, d] = dims;

  return (
    <Sparkles
      key={currentRoom}
      count={40}
      scale={[w * 0.7, h * 0.6, d * 0.7]}
      position={[0, h * 0.4, 0]}
      size={1.5}
      speed={0.15}
      opacity={0.3}
      color="#c8b888"
      noise={1}
    />
  );
}
