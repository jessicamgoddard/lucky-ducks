import Item from './Item';
import type { PickerItem } from '../utils/storage';

type Props = {
  items: PickerItem[];
  assignments: (string | null)[];
  onRevealBySlot: (slotIndex: number) => void;
};

/**
 * Component to display items arranged in a circular track.
 */
export default function ItemTrack({ items, assignments, onRevealBySlot }: Props) {
  const slots = assignments.length;
  const radius = 120; // distance from center
  const center = 150; // track is 300x300

  const map = new Map(items.map((item) => [item.id, item.label]));

  return (
    <div className="item-track" aria-label="Item track">
      <div className="track-ring" />

      <div className="rotating-layer" aria-hidden>
        {Array.from({ length: slots }).map((_, i) => {
          const angle = (i / slots) * Math.PI * 2;
          const x = center + radius * Math.cos(angle) - 30;
          const y = center + radius * Math.sin(angle) - 30;
          const itemId = assignments[i];
          const label = itemId ? map.get(itemId) ?? '—' : null;

          return (
            <Item
              key={`slot-${i}`}
              label={label ?? ''}
              revealed={false} // reveal handled by modal; visually keep ? on items
              onReveal={() => onRevealBySlot(i)}
              style={{ left: x, top: y, position: 'absolute' }}
            />
          );
        })}
      </div>
    </div>
  );
}
