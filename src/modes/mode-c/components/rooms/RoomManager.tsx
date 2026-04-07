'use client';

/**
 * RoomManager — Conditional room renderer
 *
 * Reads the current room from the gallery store and renders
 * only the active room component. Passes the transition handler
 * so doorway sensors can trigger room changes.
 *
 * Mount/unmount strategy (not hide/show) keeps the physics world clean
 * and ensures only one room's colliders exist at a time.
 */

import { useGalleryStore } from '../../stores/useGalleryStore';
import { useRoomTransition } from '../../hooks/useRoomTransition';
import { Lobby } from './Lobby';
import { ProjectsRoom } from './ProjectsRoom';
import { BioRoom } from './BioRoom';
import { SkillsRoom } from './SkillsRoom';
import { PlaygroundRoom } from './PlaygroundRoom';

export function RoomManager() {
  const currentRoom = useGalleryStore((s) => s.currentRoom);
  const { transitionTo } = useRoomTransition();

  const handleReturnToLobby = () => transitionTo('lobby');

  return (
    <>
      {currentRoom === 'lobby' && <Lobby onDoorwayEnter={transitionTo} />}
      {currentRoom === 'projects' && (
        <ProjectsRoom onReturnToLobby={handleReturnToLobby} />
      )}
      {currentRoom === 'bio' && (
        <BioRoom onReturnToLobby={handleReturnToLobby} />
      )}
      {currentRoom === 'skills' && (
        <SkillsRoom onReturnToLobby={handleReturnToLobby} />
      )}
      {currentRoom === 'playground' && (
        <PlaygroundRoom onReturnToLobby={handleReturnToLobby} />
      )}
    </>
  );
}
