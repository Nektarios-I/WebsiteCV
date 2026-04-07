'use client';

/**
 * MobileJoystick — Touch joystick for mobile/tablet gallery navigation
 *
 * Wraps ecctrl's EcctrlJoystick component, which renders a virtual
 * joystick stick + optional action buttons as a fixed overlay.
 *
 * Only mounts on touch-capable devices (detected via ontouchstart or
 * pointer coarse media query). On desktop, this component renders nothing.
 */

import { EcctrlJoystick } from 'ecctrl';
import { useState } from 'react';

function useIsTouchDevice(): boolean {
  const [isTouch] = useState(() => {
    if (typeof window === 'undefined') return false;
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches
    );
  });

  return isTouch;
}

export function MobileJoystick() {
  const isTouch = useIsTouchDevice();

  if (!isTouch) return null;

  return (
    <EcctrlJoystick
      joystickPositionLeft={30}
      joystickPositionBottom={30}
      joystickHeightAndWidth={120}
      joystickRunSensitivity={0.7}
      buttonNumber={1}
      buttonPositionRight={30}
      buttonPositionBottom={30}
    />
  );
}
