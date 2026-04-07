'use client';

/**
 * RobotCharacter — Animated low-poly robot from Quaternius (CC0)
 *
 * Loads Robot.fbx from /models/ and plays the correct animation clip
 * based on ecctrl's movement state via useGame().curAnimation.
 *
 * Available animations in the FBX (15 clips):
 *   Robot_Idle, Robot_Walking, Robot_Running, Robot_Jump,
 *   Robot_Dance, Robot_Death, Robot_No, Robot_Punch,
 *   Robot_Sitting, Robot_Standing, Robot_ThumbsUp,
 *   Robot_WalkJump, Robot_Wave, Robot_Yes, Robot_IdleHH2
 *
 * Body rotation (turning to face movement direction) is handled
 * by ecctrl's characterModelRef group — NOT by this component.
 * We only handle:
 *   1. Initializing ecctrl's animationSet so it can set curAnimation
 *   2. Crossfading between FBX clips based on curAnimation changes
 */

import { useEffect, useMemo, useRef } from 'react';
import { useFBX, useAnimations } from '@react-three/drei';
import { useGame } from 'ecctrl';
import * as THREE from 'three';

// Prefix in the FBX clip names
const PREFIX = 'RobotArmature|';

/**
 * AnimationSet labels — these are the keys ecctrl will write
 * to useGame().curAnimation when movement state changes.
 */
const ANIMATION_SET = {
  idle: 'idle',
  walk: 'walk',
  run: 'run',
  jump: 'jump',
  jumpIdle: 'jumpIdle',
  jumpLand: 'jumpLand',
  fall: 'fall',
} as const;

/**
 * Map ecctrl animation state labels → FBX clip names (without prefix).
 */
const ANIM_MAP: Record<string, string> = {
  idle: 'Robot_Idle',
  walk: 'Robot_Walking',
  run: 'Robot_Running',
  jump: 'Robot_Jump',
  jumpIdle: 'Robot_Jump',
  jumpLand: 'Robot_Idle',
  fall: 'Robot_Jump',
};

/** Default fallback */
const DEFAULT_CLIP = 'Robot_Idle';

/** Crossfade duration in seconds */
const FADE_DURATION = 0.25;

/** Scale — tuned so the robot is proportional to the gallery rooms */
const ROBOT_SCALE = 0.0012;

// Preload the FBX so it starts downloading immediately
useFBX.preload('/models/Robot.fbx');

export function RobotCharacter() {
  const groupRef = useRef<THREE.Group>(null);

  // Load the FBX (suspends until ready — parent must have <Suspense>)
  const fbx = useFBX('/models/Robot.fbx');

  // Clone the scene so animations are independent
  const clonedScene = useMemo(() => {
    const clone = fbx.clone(true);
    // Enable shadows on all meshes
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return clone;
  }, [fbx]);

  // Setup animation mixer via drei's useAnimations
  const { actions, mixer } = useAnimations(fbx.animations, groupRef);

  // Initialize ecctrl's animation set so it can update curAnimation
  const initializeAnimationSet = useGame(
    (s) => s.initializeAnimationSet,
  );
  useEffect(() => {
    initializeAnimationSet(ANIMATION_SET);
  }, [initializeAnimationSet]);

  // Track the ecctrl movement state
  const curAnimation = useGame((s) => s.curAnimation);
  const resetAnimation = useGame((s) => s.reset);
  const prevClipRef = useRef<string | null>(null);

  // Crossfade to the correct animation when movement state changes
  useEffect(() => {
    if (!actions || Object.keys(actions).length === 0) return;

    const robotClipName = ANIM_MAP[curAnimation ?? 'idle'] ?? DEFAULT_CLIP;

    // Clips in the FBX are named with prefix: "RobotArmature|Robot_Walking"
    const fullName = `${PREFIX}${robotClipName}`;
    const action = actions[fullName] ?? actions[robotClipName];

    if (!action) return;

    // Skip if already playing this clip
    if (prevClipRef.current === fullName) return;

    // Fade out previous
    if (prevClipRef.current) {
      const prev =
        actions[prevClipRef.current] ??
        actions[prevClipRef.current.replace(PREFIX, '')];
      prev?.fadeOut(FADE_DURATION);
    }

    // For jump/jumpLand/fall — play once
    if (
      curAnimation === 'jump' ||
      curAnimation === 'jumpLand' ||
      curAnimation === 'fall'
    ) {
      action
        .reset()
        .fadeIn(FADE_DURATION)
        .setLoop(THREE.LoopOnce, 1)
        .play();
    } else {
      // Looping animations (idle, walk, run)
      action.reset().fadeIn(FADE_DURATION).play();
    }

    prevClipRef.current = fullName;
  }, [curAnimation, actions]);

  // When a clamped (one-shot) animation finishes, reset to idle
  useEffect(() => {
    if (!mixer) return;

    const onFinished = () => {
      resetAnimation();
    };

    mixer.addEventListener('finished', onFinished);
    return () => {
      mixer.removeEventListener('finished', onFinished);
    };
  }, [mixer, resetAnimation]);

  return (
    <group ref={groupRef}>
      <primitive
        object={clonedScene}
        scale={ROBOT_SCALE}
        rotation={[0, 0, 0]}
      />
    </group>
  );
}
