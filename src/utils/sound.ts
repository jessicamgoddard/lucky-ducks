import squeakUrl from '../assets/duck-squeak.m4a';
import quackUrl from '../assets/duck-quack.mp3';

/**
 * Which sound to play for a pick: a rubber-duck squeak for a real option, a
 * plain quack for a decoy.
 */
export type PickSound = 'success' | 'dud';

const SOUND_URLS: Record<PickSound, string> = {
  success: squeakUrl,
  dud: quackUrl,
};

/**
 * Play the sound for a pick. A fresh audio element is used each time so quick
 * back-to-back picks can overlap. Silently does nothing where audio is
 * unavailable or blocked.
 */
export function playPickSound(kind: PickSound) {
  try {
    // play() returns a promise that rejects if the browser blocks playback
    new Audio(SOUND_URLS[kind]).play().catch(() => {});
  } catch {} // eslint-disable-line no-empty
}
