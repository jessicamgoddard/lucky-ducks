/**
 * A small wrapper for persistent storage of the options list.
 */

const STORAGE_ITEMS_KEY = 'random-picker-items';
const STORAGE_SETTINGS_KEY = 'random-picker-settings';

export type PickerItem = {
  id: string;
  label: string;
};

/**
 * Whether a value from storage has the shape of a PickerItem.
 * A blank label is rejected too: the reveal shows nothing for one.
 */
function isPickerItem(value: unknown): value is PickerItem {
  if (typeof value !== 'object' || value === null) return false;
  const { id, label } = value as Record<string, unknown>;
  return typeof id === 'string' && typeof label === 'string' && label.trim() !== '';
}

/**
 * Load items from localStorage.
 * 
 * @return Array of PickerItem
 */
export function loadItems(): PickerItem[] {
  try {
    // Try to get our items from localStorage
    const raw = localStorage.getItem(STORAGE_ITEMS_KEY);
    // If nothing found, return empty array
    if (!raw) return [];
    // Parse, and keep only well-formed items so bad saved data can't crash the app
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isPickerItem) : [];
  } catch {
    // Otherwise, return empty array
    return [];
  }
}

/**
 * Save items to localStorage.
 * 
 * @param items Array of PickerItem to save
 */
export function saveItems(items: PickerItem[]) {
  try {
    // Try to save our items to localStorage
    localStorage.setItem(STORAGE_ITEMS_KEY, JSON.stringify(items));
  } catch {} // eslint-disable-line no-empty
}

/**
 * Player preferences from the settings panel.
 */
export type Settings = {
  // Play quacks when a duck is picked
  sounds: boolean;
  // Include decoy ducks that hide a pun instead of an option
  decoys: boolean;
};

export const DEFAULT_SETTINGS: Settings = { sounds: true, decoys: true };

/**
 * Load settings from localStorage. Anything missing or not a boolean falls
 * back to its default, so bad saved data can't break the app.
 */
export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return DEFAULT_SETTINGS;
    const { sounds, decoys } = parsed as Record<string, unknown>;
    return {
      sounds: typeof sounds === 'boolean' ? sounds : DEFAULT_SETTINGS.sounds,
      decoys: typeof decoys === 'boolean' ? decoys : DEFAULT_SETTINGS.decoys,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

/**
 * Save settings to localStorage.
 *
 * @param settings The settings to save
 */
export function saveSettings(settings: Settings) {
  try {
    localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(settings));
  } catch {} // eslint-disable-line no-empty
}
