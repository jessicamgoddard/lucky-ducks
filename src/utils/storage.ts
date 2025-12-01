/**
 * A small wrapper for persistent storage with versioning.
 */

const STORAGE_KEY = 'random-picker-items-v1';

export type PickerItem = {
  id: string;
  label: string;
};

/**
 * Load items from localStorage.
 * 
 * @return Array of PickerItem
 */
export function loadItems(): PickerItem[] {
  try {
    // Try to get our items from localStorage
    const raw = localStorage.getItem(STORAGE_KEY);
    // If nothing found, return empty array
    if (!raw) return [];
    // Parse and return the items
    return JSON.parse(raw) as PickerItem[];
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {} // eslint-disable-line no-empty
}
