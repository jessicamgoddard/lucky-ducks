import { useState, useEffect } from 'react';
import ItemList from './components/ItemList';
import Controls from './components/Controls';
import {
  loadItems,
  saveItems,
  type PickerItem
} from './utils/storage';

/**
 * Main application component.
 */
export default function App() {
  // State for the list of items (initialized from storage to avoid setting state inside an effect)
  const [items, setItems] = useState<PickerItem[]>(() => loadItems());

  // Save items on change
  useEffect(() => {
    // Save items to localStorage
    saveItems(items);
  }, [items]);

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
  };

  // Clear all items
  const clearAll = () => {
    setItems([]);
  };

  return (
    <div className="app-container">
      <h1>Random Picker</h1>

      <ItemList
        items={items}
        onAdd={addItem}
        onUpdate={updateItem}
        onDelete={deleteItem}
      />

      <Controls onClear={clearAll} />
    </div>
  );
}
