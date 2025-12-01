import { useState } from 'react';
import type { PickerItem } from '../utils/storage';

type Props = {
  items: PickerItem[];
  onAdd: (label: string) => void;
  onUpdate: (id: string, label: string) => void;
  onDelete: (id: string) => void;
};

/**
 * Component to display and manage a list of items.
 */
export default function ItemList({ items, onAdd, onUpdate, onDelete }: Props) {
  // Set up states for new item and editing
  const [newLabel, setNewLabel] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  // Handle editing an item
  const startEdit = (item: PickerItem) => {
    setEditingId(item.id);
    setEditValue(item.label);
  };

  // Handle finishing editing an item
  const finishEdit = () => {
    if (editingId && editValue.trim()) {
      onUpdate(editingId, editValue.trim());
    }
    setEditingId(null);
    setEditValue('');
  };

  return (
    <div className="item-list">
      <h3>Items</h3>

      {/* Add new item */}
      <div className="add-item">
        <input
          type="text"
          placeholder="Add item..."
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && newLabel.trim() && (onAdd(newLabel.trim()), setNewLabel(''))}
        />
        <button
          onClick={() => {
            if (newLabel.trim()) {
              onAdd(newLabel.trim());
              setNewLabel('');
            }
          }}
        >
          Add
        </button>
      </div>

      {/* List existing items */}
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {editingId === item.id ? (
              <>
                <input
                  autoFocus
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && finishEdit()}
                />
                <button onClick={finishEdit}>Save</button>
              </>
            ) : (
              <>
                <span>{item.label}</span>
                <button onClick={() => startEdit(item)}>Edit</button>
                <button onClick={() => onDelete(item.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
