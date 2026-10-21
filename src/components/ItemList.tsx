import { useEffect, useRef, useState } from 'react';
import type { PickerItem } from '../utils/storage';

import '../scss/components/_itemList.scss';

type Props = {
  items: PickerItem[];
  onAdd: (label: string) => void;
  onClear: () => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, label: string) => void;
};

/**
 * Component to display and manage a list of items.
 */
export default function ItemList({ items, onAdd, onClear, onDelete, onUpdate }: Props) {
  // Set up states for new item and editing
  const [newLabel, setNewLabel] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  // Refs used to put focus somewhere sensible when the focused control goes away
  const addInputRef = useRef<HTMLInputElement>(null);
  const editButtons = useRef(new Map<string, HTMLButtonElement>());
  const pendingFocusId = useRef<string | null>(null);

  // After an edit ends, return focus to that item's Edit button
  useEffect(() => {
    if (editingId === null && pendingFocusId.current) {
      editButtons.current.get(pendingFocusId.current)?.focus();
      pendingFocusId.current = null;
    }
  }, [editingId]);

  // Handle adding the new item
  const addItem = () => {
    if (newLabel.trim()) {
      onAdd(newLabel.trim());
      setNewLabel('');
    }
  };

  // Handle editing an item
  const startEdit = (item: PickerItem) => {
    setEditingId(item.id);
    setEditValue(item.label);
  };

  // Handle leaving edit mode, saving only when asked to
  const endEdit = (save: boolean) => {
    if (save && editingId && editValue.trim()) {
      onUpdate(editingId, editValue.trim());
    }
    pendingFocusId.current = editingId;
    setEditingId(null);
    setEditValue('');
  };

  return (
    <div className="item-list">
      {/* Add new item */}
      <div className="item-list__add">
        <input
          ref={addInputRef}
          type="text"
          placeholder="Add item..."
          aria-label="New option"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addItem()}
        />
        <button onClick={addItem}>Add</button>
      </div>

      <div className="item-list__controls">
        <button
          onClick={() => {
            onClear();
            addInputRef.current?.focus();
          }}
          disabled={items.length === 0}
        >
          Clear All
        </button>
      </div>

      {/* List existing items */}
      <ul className="item-list__items" aria-label="Options">
        {items.map((item) => (
          <li className="item-list__item" key={item.id}>
            {editingId === item.id ? (
              <>
                <input
                  autoFocus
                  aria-label={`Edit ${item.label}`}
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') endEdit(true);
                    if (e.key === 'Escape') endEdit(false);
                  }}
                />
                <button onClick={() => endEdit(true)}>Save</button>
              </>
            ) : (
              <>
                <span>{item.label}</span>
                <button
                  ref={(el) => {
                    if (el) editButtons.current.set(item.id, el);
                    else editButtons.current.delete(item.id);
                  }}
                  onClick={() => startEdit(item)}
                  aria-label={`Edit ${item.label}`}
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    onDelete(item.id);
                    addInputRef.current?.focus();
                  }}
                  aria-label={`Delete ${item.label}`}
                >
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
