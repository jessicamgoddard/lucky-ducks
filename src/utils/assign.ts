/**
 * Create random assignment of item ids into N slots.
 * Items will be randomly shuffled and placed into random slots.
 * If there are fewer items than slots, remaining slots are null.
 */
export function randomAssign(itemIds: string[], slots = 12): (string | null)[] {
  // Initialize assignments array with nulls
  const assignments: (string | null)[] = Array.from({ length: slots }, () => null);

  // Shuffle item IDs using Fisher-Yates algorithm
  const copy = itemIds.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  // Assign shuffled items to random slots
  const slotIndices = Array.from({ length: slots }, (_, i) => i);
  for (let i = slotIndices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [slotIndices[i], slotIndices[j]] = [slotIndices[j], slotIndices[i]];
  }

  // Fill slots with items
  for (let i = 0; i < copy.length && i < slots; i++) {
    assignments[slotIndices[i]] = copy[i];
  }

  return assignments;
}
