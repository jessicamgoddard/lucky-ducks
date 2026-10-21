import { useState, useEffect, useRef } from 'react';
import ItemList from './components/ItemList';
import ItemTrack from './components/ItemTrack';
import Reveal from './components/Reveal';
import { loadItems, saveItems, type PickerItem } from './utils/storage';
import { buildPond, revealDuck, syncPond, type Duck, type DuckContent } from './utils/pond';

type Phase = 'setup' | 'pond';

// Appended to a repeated announcement so the live region changes and is read again
const NBSP = '\u00A0';

/**
 * Main application component.
 */
export default function App() {
  // Set states
  const [items, setItems] = useState<PickerItem[]>(() => loadItems());
  const [phase, setPhase] = useState<Phase>('setup');
  const [ducks, setDucks] = useState<Duck[]>([]);
  const [editing, setEditing] = useState(false);
  const [paused, setPaused] = useState(false);
  const [revealed, setRevealed] = useState<DuckContent | null>(null);
  const [announcement, setAnnouncement] = useState('');

  const phaseHeadingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  // Save items on change. The pond itself is never persisted.
  useEffect(() => {
    saveItems(items);
  }, [items]);

  // Move focus to the new screen's heading when the phase changes, since the
  // button that was pressed has just been removed
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    phaseHeadingRef.current?.focus();
  }, [phase]);

  // Announce a message to screen readers. Repeating the same message appends a
  // non-breaking space so it is read again.
  const announce = (message: string) => {
    setAnnouncement((prev) => (prev === message ? `${message}${NBSP}` : message));
  };

  // Apply a new options list and keep the pond in step with it
  const commitItems = (next: PickerItem[], message: string) => {
    setItems(next);
    if (phase === 'pond') {
      setDucks((prev) => syncPond(prev, next));
    }
    announce(message);
  };

  const optionCount = (n: number) => `${n} ${n === 1 ? 'option' : 'options'}`;

  // Handlers for item operations
  const addItem = (label: string) => {
    const next = [...items, { id: crypto.randomUUID(), label }];
    commitItems(next, `Added ${label}. ${optionCount(next.length)}.`);
  };

  const updateItem = (id: string, label: string) => {
    commitItems(items.map((i) => (i.id === id ? { ...i, label } : i)), `Renamed to ${label}.`);
  };

  const deleteItem = (id: string) => {
    const removed = items.find((i) => i.id === id);
    const next = items.filter((i) => i.id !== id);
    commitItems(next, `Removed ${removed?.label ?? 'option'}. ${optionCount(next.length)}.`);
  };

  const clearAll = () => {
    commitItems([], 'All options cleared.');
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
    <>
      {/* Everything behind the reveal is inert while it is open */}
      <main className={`main${paused ? ' is-paused' : ''}`} inert={revealed !== null}>
        <div className="container">
          <h1 className="title">Random Picker</h1>

          {phase === 'setup' ? (
            <>
              <h2 className="subtitle" tabIndex={-1} ref={phaseHeadingRef}>Add your options</h2>
              {itemList}
              <div className="actions">
                <button
                  className="button--primary"
                  onClick={startGame}
                  disabled={items.length === 0}
                  aria-describedby={items.length === 0 ? 'start-hint' : undefined}
                >
                  Start
                </button>
                {items.length === 0 && (
                  <p className="hint" id="start-hint">Add at least one option to start.</p>
                )}
              </div>
            </>
          ) : (
            <>
              <h2 className="subtitle" tabIndex={-1} ref={phaseHeadingRef}>Pick a duck</h2>
              <div className="actions">
                <button
                  onClick={() => {
                    reshuffle();
                    announce('Ducks reshuffled.');
                  }}
                >
                  Reshuffle
                </button>
                <button onClick={() => setPaused((p) => !p)} aria-pressed={paused}>
                  Pause ducks
                </button>
                <button
                  onClick={() => setEditing((e) => !e)}
                  aria-expanded={editing}
                >
                  Edit options
                </button>
                <button onClick={backToSetup}>Back to setup</button>
              </div>
              {editing && itemList}
            </>
          )}
        </div>

        {phase === 'pond' && <ItemTrack ducks={ducks} onPick={handlePick} />}
      </main>

      <Reveal
        heading={revealed?.kind === 'decoy' ? 'Quack!' : 'You picked:'}
        celebrate={revealed?.kind === 'option'}
        label={revealed ? (revealed.kind === 'option' ? revealed.label : revealed.pun) : null}
        onClose={closeReveal}
      />

      <div className="visually-hidden" role="status" aria-live="polite">{announcement}</div>
    </>
  );
}
