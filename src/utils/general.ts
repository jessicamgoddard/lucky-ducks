/**
 * Generate a random number between min and max (inclusive).
 */
export function getRandomNumber(min: number, max: number) {
  return Math.random() * (max - min + 1) + min;
}

/**
 * Calculate top position for an item based on its slot position and total number of slots.
 */
export function getItemTop(slot: number, totalSlots: number) {
  const spacePerItem = 60 / totalSlots;

 return slot * spacePerItem;
}