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
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error loading items', err);
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Error saving items', err);
  }
}
