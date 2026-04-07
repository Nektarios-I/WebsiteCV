'use client';

/**
 * CameraSettingsPanel — Camera preset picker + custom editor
 *
 * A floating button that opens a popup with:
 * 1. Predefined camera presets (Third Person, First Person, etc.)
 * 2. Custom mode with sliders for distance, pitch, FOV, target height
 * 3. Save button that closes the panel (settings persist via localStorage)
 * 4. Reset button to return to defaults
 */

import { useState, useCallback, useRef, useEffect } from 'react';

import { useCameraStore } from '../../stores/useCameraStore';
import {
  CAMERA_PRESETS,
  CAMERA_LIMITS,
  type PresetId,
} from '../../lib/camera-presets';

const PRESET_KEYS = Object.keys(CAMERA_PRESETS) as Exclude<
  PresetId,
  'custom'
>[];

export function CameraSettingsPanel() {
  const isPanelOpen = useCameraStore((s) => s.isPanelOpen);
  const togglePanel = useCameraStore((s) => s.togglePanel);
  const setPanelOpen = useCameraStore((s) => s.setPanelOpen);
  const activePreset = useCameraStore((s) => s.activePreset);
  const settings = useCameraStore((s) => s.settings);
  const customSettings = useCameraStore((s) => s.customSettings);
  const setPreset = useCameraStore((s) => s.setPreset);
  const updateCustomSettings = useCameraStore((s) => s.updateCustomSettings);
  const resetCamera = useCameraStore((s) => s.resetCamera);

  const [showCustom, setShowCustom] = useState(activePreset === 'custom');
  const panelRef = useRef<HTMLDivElement>(null);

  // Close panel when clicking outside
  useEffect(() => {
    if (!isPanelOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setPanelOpen(false);
      }
    };
    // Delay to avoid the toggle button click closing it immediately
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClick);
    }, 100);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClick);
    };
  }, [isPanelOpen, setPanelOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isPanelOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPanelOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isPanelOpen, setPanelOpen]);

  const handlePresetClick = useCallback(
    (presetId: Exclude<PresetId, 'custom'>) => {
      setPreset(presetId);
      setShowCustom(false);
    },
    [setPreset],
  );

  const handleCustomToggle = useCallback(() => {
    setShowCustom(true);
    setPreset('custom');
  }, [setPreset]);

  const handleSave = useCallback(() => {
    setPanelOpen(false);
  }, [setPanelOpen]);

  const handleReset = useCallback(() => {
    resetCamera();
    setShowCustom(false);
  }, [resetCamera]);

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={togglePanel}
        className={`absolute bottom-4 left-4 z-20 rounded-lg px-3 py-1.5 text-sm shadow-sm backdrop-blur-sm transition-colors ${
          isPanelOpen
            ? 'bg-blue-500/80 text-white hover:bg-blue-600/90'
            : 'bg-white/70 text-gray-600 hover:bg-white/90 hover:text-gray-900'
        }`}
        aria-label={
          isPanelOpen ? 'Close camera settings' : 'Open camera settings'
        }
        aria-expanded={isPanelOpen}
      >
        📷 Camera
      </button>

      {/* Settings Panel */}
      {isPanelOpen && (
        <div
          ref={panelRef}
          className="absolute bottom-14 left-4 z-30 max-h-[70vh] w-80 overflow-y-auto rounded-xl bg-gray-900/90 p-4 text-white shadow-2xl backdrop-blur-md"
          role="dialog"
          aria-label="Camera Settings"
          aria-modal="false"
        >
          <h3 className="mb-3 text-base font-semibold">Camera Settings</h3>

          {/* Presets Grid */}
          <div className="mb-3 grid grid-cols-1 gap-1.5">
            {PRESET_KEYS.map((presetId) => {
              const preset = CAMERA_PRESETS[presetId];
              const isActive = activePreset === presetId && !showCustom;
              return (
                <button
                  key={presetId}
                  onClick={() => handlePresetClick(presetId)}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                    isActive
                      ? 'bg-blue-500/40 ring-1 ring-blue-400'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                  aria-pressed={isActive}
                >
                  <span className="text-lg">{preset.icon}</span>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium">{preset.label}</div>
                    <div className="truncate text-xs text-gray-400">
                      {preset.description}
                    </div>
                  </div>
                </button>
              );
            })}

            {/* Custom option */}
            <button
              onClick={handleCustomToggle}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                showCustom
                  ? 'bg-blue-500/40 ring-1 ring-blue-400'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
              aria-pressed={showCustom}
            >
              <span className="text-lg">⚙️</span>
              <div className="min-w-0 flex-1">
                <div className="font-medium">Custom</div>
                <div className="truncate text-xs text-gray-400">
                  Manually adjust camera parameters
                </div>
              </div>
            </button>
          </div>

          {/* Custom Sliders */}
          {showCustom && (
            <div className="mb-3 space-y-3 rounded-lg bg-white/5 p-3">
              <h4 className="mb-2 text-xs font-semibold tracking-wider text-gray-400 uppercase">
                Custom Settings
              </h4>

              {/* Distance */}
              <SliderField
                label={CAMERA_LIMITS.camInitDis.label}
                value={customSettings.camInitDis}
                min={CAMERA_LIMITS.camInitDis.min}
                max={CAMERA_LIMITS.camInitDis.max}
                step={CAMERA_LIMITS.camInitDis.step}
                displayValue={`${Math.abs(customSettings.camInitDis).toFixed(1)}m`}
                onChange={(v) => {
                  // Compute max/min automatically from distance
                  const maxDis = Math.min(v * 1.4, -0.1);
                  const minDis = Math.max(v * 0.4, -0.1);
                  updateCustomSettings({
                    camInitDis: v,
                    camMaxDis: maxDis,
                    camMinDis: minDis,
                  });
                }}
              />

              {/* Pitch */}
              <SliderField
                label={CAMERA_LIMITS.pitch.label}
                value={customSettings.camInitDir.x}
                min={CAMERA_LIMITS.pitch.min}
                max={CAMERA_LIMITS.pitch.max}
                step={CAMERA_LIMITS.pitch.step}
                displayValue={`${((customSettings.camInitDir.x * 180) / Math.PI).toFixed(0)}°`}
                onChange={(v) =>
                  updateCustomSettings({
                    camInitDir: { x: v, y: 0 },
                  })
                }
              />

              {/* FOV */}
              <SliderField
                label={CAMERA_LIMITS.fov.label}
                value={customSettings.fov}
                min={CAMERA_LIMITS.fov.min}
                max={CAMERA_LIMITS.fov.max}
                step={CAMERA_LIMITS.fov.step}
                displayValue={`${customSettings.fov}°`}
                onChange={(v) => updateCustomSettings({ fov: v })}
              />

              {/* Target Height */}
              <SliderField
                label={CAMERA_LIMITS.targetHeight.label}
                value={customSettings.camTargetPos.y}
                min={CAMERA_LIMITS.targetHeight.min}
                max={CAMERA_LIMITS.targetHeight.max}
                step={CAMERA_LIMITS.targetHeight.step}
                displayValue={`${customSettings.camTargetPos.y.toFixed(1)}m`}
                onChange={(v) =>
                  updateCustomSettings({
                    camTargetPos: { x: 0, y: v, z: 0 },
                  })
                }
              />
            </div>
          )}

          {/* Current info */}
          <div className="mb-3 rounded-lg bg-white/5 px-3 py-2 text-xs text-gray-400">
            Active:{' '}
            <span className="text-gray-200">
              {activePreset === 'custom'
                ? 'Custom'
                : CAMERA_PRESETS[activePreset as Exclude<PresetId, 'custom'>]
                    ?.label}
            </span>
            {' · '}FOV {settings.fov}° · Dist{' '}
            {Math.abs(settings.camInitDis).toFixed(1)}m
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 rounded-lg bg-blue-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
            >
              ✓ Save & Close
            </button>
            <button
              onClick={handleReset}
              className="rounded-lg bg-white/10 px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-white/20"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/* ---------- Slider sub-component ---------- */

interface SliderFieldProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  displayValue: string;
  onChange: (value: number) => void;
}

function SliderField({
  label,
  value,
  min,
  max,
  step,
  displayValue,
  onChange,
}: SliderFieldProps) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-gray-300">{label}</span>
        <span className="font-mono text-gray-400">{displayValue}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/20 accent-blue-400"
        aria-label={label}
      />
    </div>
  );
}
