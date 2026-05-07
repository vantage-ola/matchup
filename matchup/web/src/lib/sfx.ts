import { loadSettings } from './settings';

export type SoundName =
  | 'pass'
  | 'kick'
  | 'tackle'
  | 'whistle'
  | 'goal'
  | 'blip';

export function play(_name: SoundName): void {
  const settings = loadSettings();
  if (!settings.soundEnabled || settings.volume <= 0) return;
  void _name;
  // No-op until Slice 2 wires real audio. Keeping the gate here lets
  // future work add `new Audio(...)` without re-plumbing call sites.
}
