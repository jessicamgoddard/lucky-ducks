/**
 * A small wrapper for persistent storage with versioning.
 */

const STORAGE_ITEMS_KEY = 'random-picker-items';
const STORAGE_ASSIGN_KEY = 'random-picker-assignments';

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
    const raw = localStorage.getItem(STORAGE_ITEMS_KEY);
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
    localStorage.setItem(STORAGE_ITEMS_KEY, JSON.stringify(items));
  } catch {} // eslint-disable-line no-empty
}

/**
 * Load assignments from localStorage.
 * 
 * @return Array of item IDs or nulls, or null if none found
 */
export function loadAssignments(): (string | null)[] | null {
  try {
    // Try to get our assignments from localStorage
    const raw = localStorage.getItem(STORAGE_ASSIGN_KEY);
    // If nothing found, return null
    if (!raw) return null;
    // Parse and return the assignments
    return JSON.parse(raw) as (string | null)[];
  } catch {
    return null;
  }
}

/**
 * Save assignments to localStorage.
 * 
 * @param assignments Array of item IDs or nulls
 */
export function saveAssignments(assignments: (string | null)[]) {
  try {
    // Try to save our assignments to localStorage
    localStorage.setItem(STORAGE_ASSIGN_KEY, JSON.stringify(assignments));
  } catch {} // eslint-disable-line no-empty
}
