/**
 * A small wrapper for persistent storage with versioning.
 */

const STORAGE_ITEMS_KEY = 'random-picker-items';

export type PickerItem = {
  id: string;
  label: string;
};

/**
 * Whether a value from storage has the shape of a PickerItem.
 */
function isPickerItem(value: unknown): value is PickerItem {
  if (typeof value !== 'object' || value === null) return false;
  const { id, label } = value as Record<string, unknown>;
  return typeof id === 'string' && typeof label === 'string';
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
