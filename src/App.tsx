import { useState, useEffect } from 'react';
import ItemList from './components/ItemList';
import Controls from './components/Controls';
import ItemTrack from './components/ItemTrack';
import RevealModal from './components/RevealModal';
import {
  loadItems,
  saveItems,
  loadAssignments,
  saveAssignments,
  type PickerItem
} from './utils/storage';
import { randomAssign } from './utils/assign';

const DEFAULT_SLOTS = 3;

/**
 * Main application component.
 */
export default function App() {
  // Set states
  const [items, setItems] = useState<PickerItem[]>(() => loadItems());
  const [assignments, setAssignments] = useState<(string | null)[]>(
    () => loadAssignments() ?? []
  );
  const [revealedLabel, setRevealedLabel] = useState<string | null>(null);

  // Save items on change
  useEffect(() => {
    // Save items to localStorage
    saveItems(items);
  }, [items]);

  // Save assignments on change
  useEffect(() => {
    saveAssignments(assignments);
  }, [assignments]);

  // Handlers for item operations
  const addItem = (label: string) => {
    // Add a new item with a unique ID
    setItems((prev) => [
      ...prev,
      { id: crypto.randomUUID(), label }
    ]);
  };

  // Update an existing item
  const updateItem = (id: string, label: string) => {
    // Update the label of the item with the given ID
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, label } : i))
    );
  };

  // Delete an item by ID
  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    // Also remove references in assignments
    setAssignments((prev) => prev.map((a) => (a === id ? null : a)));
  };

  // Clear all items
  const clearAll = () => {
    setItems([]);
    setAssignments(Array.from({ length: DEFAULT_SLOTS }, () => null));
  };

  // Shuffle assignments
  const shuffleAssignments = () => {
    const ids = items.map((i) => i.id);
    const next = randomAssign(ids, items.length);
    setAssignments(next);
  };

  // Handle revealing an item by slot index
  const handleRevealBySlot = (slotIndex: number) => {
    const itemId = assignments[slotIndex];
    const item = items.find((i) => i.id === itemId);
    setRevealedLabel(item ? item.label : 'Nothing here');
  };

  const closeModal = () => setRevealedLabel(null);

  return (
    <div className="app">
      <h1 className="app__title">Random Picker</h1>

      <ItemTrack
        items={items}
        assignments={assignments}
        onRevealBySlot={handleRevealBySlot}
      />

      <div className="app__controls">
        <ItemList
          items={items}
          onAdd={addItem}
          onUpdate={updateItem}
          onDelete={deleteItem}
        />

        <Controls
          onClear={clearAll}
          onShuffle={shuffleAssignments}
        />
      </div>

      <RevealModal
        label={revealedLabel}
        onClose={closeModal}
      />
    </div>
  );
}
