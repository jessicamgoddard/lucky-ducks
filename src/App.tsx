import { useState, useEffect } from 'react';
import ItemList from './components/ItemList';
import ItemTrack from './components/ItemTrack';
import Reveal from './components/Reveal';
import { loadItems, saveItems, type PickerItem } from './utils/storage';
import { buildPond, revealDuck, syncPond, type Duck, type DuckContent } from './utils/pond';

type Phase = 'setup' | 'pond';

/**
 * Main application component.
 */
export default function App() {
  // Set states
  const [items, setItems] = useState<PickerItem[]>(() => loadItems());
  const [phase, setPhase] = useState<Phase>('setup');
  const [ducks, setDucks] = useState<Duck[]>([]);
  const [editing, setEditing] = useState(false);
  const [revealed, setRevealed] = useState<DuckContent | null>(null);

  // Save items on change. The pond itself is never persisted.
  useEffect(() => {
    saveItems(items);
  }, [items]);

  // Apply a new options list and keep the pond in step with it
  const commitItems = (next: PickerItem[]) => {
    setItems(next);
    if (phase === 'pond') {
      setDucks((prev) => syncPond(prev, next));
    }
  };

  // Handlers for item operations
  const addItem = (label: string) => {
    commitItems([...items, { id: crypto.randomUUID(), label }]);
  };

  const updateItem = (id: string, label: string) => {
    commitItems(items.map((i) => (i.id === id ? { ...i, label } : i)));
  };

  const deleteItem = (id: string) => {
    commitItems(items.filter((i) => i.id !== id));
  };

  const clearAll = () => {
    commitItems([]);
  };

  // Start the game: fill the pond and show it
  const startGame = () => {
    setDucks(buildPond(items));
    setEditing(false);
    setPhase('pond');
  };

  // Go back to the setup screen
  const backToSetup = () => {
    setDucks([]);
    setRevealed(null);
    setPhase('setup');
  };

  // Re-deal what the ducks hide
  const reshuffle = () => {
    setDucks((prev) => syncPond(prev, items));
  };

  // Handle a duck being picked. The pond is re-dealt so every pick is a fresh draw.
  const handlePick = (duckId: string) => {
    setRevealed(revealDuck(ducks, duckId));
    reshuffle();
  };

  const closeReveal = () => setRevealed(null);

  const itemList = (
    <div className="controls">
      <ItemList
        items={items}
        onAdd={addItem}
        onClear={clearAll}
        onDelete={deleteItem}
        onUpdate={updateItem}
      />
    </div>
  );

  return (
    <div className="main">
      <div className="container">
        <h1 className="title">Random Picker</h1>

        {phase === 'setup' ? (
          <>
            {itemList}
            <div className="actions">
              <button className="button--primary" onClick={startGame} disabled={items.length === 0}>
                Start
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="actions">
              <button onClick={reshuffle}>Reshuffle</button>
              <button onClick={() => setEditing((e) => !e)}>
                {editing ? 'Hide options' : 'Edit options'}
              </button>
              <button onClick={backToSetup}>Back to setup</button>
            </div>
            {editing && itemList}
          </>
        )}
      </div>

      {phase === 'pond' && <ItemTrack ducks={ducks} onPick={handlePick} />}

      <Reveal
        heading={revealed?.kind === 'decoy' ? 'Quack!' : 'You picked:'}
        celebrate={revealed?.kind === 'option'}
        label={revealed ? (revealed.kind === 'option' ? revealed.label : revealed.pun) : null}
        onClose={closeReveal}
      />
    </div>
  );
}
