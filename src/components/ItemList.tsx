import { useState } from 'react';
import type { PickerItem } from '../utils/storage';

import '../scss/components/_itemList.scss';

type Props = {
  items: PickerItem[];
  onAdd: (label: string) => void;
  onClear: () => void;
  onDelete: (id: string) => void;
  onShuffle: () => void;
  onUpdate: (id: string, label: string) => void;
};

/**
 * Component to display and manage a list of items.
 */
export default function ItemList({ items, onAdd, onClear, onDelete, onShuffle, onUpdate }: Props) {
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
      {/* Add new item */}
      <div className="item-list__add">
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
      
      <div className="item-list__controls">
        <button onClick={onShuffle}>Shuffle</button>
        <button onClick={onClear}>Clear All</button>
      </div>

      {/* List existing items */}
      <ul className="item-list__items">
        {items.map((item) => (
          <li className="item-list__item" key={item.id}>
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
