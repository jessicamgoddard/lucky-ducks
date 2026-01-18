import Item from './Item';
import type { PickerItem } from '../utils/storage';

import '../scss/components/_itemTrack.scss';

type Props = {
  items: PickerItem[];
  assignments: (string | null)[];
  onRevealBySlot: (slotIndex: number) => void;
};

/**
 * Component to display items on a track.
 */
export default function ItemTrack({ items, assignments, onRevealBySlot }: Props) {
  const slots = assignments.length;
  const map = new Map(items.map((item) => [item.id, item.label]));

  return (
    <div className="item-track" aria-label="Item track">
      <div className="item-track__edge" />
      <div className="item-track__track" />

      <div className="item-track__items" aria-hidden>
        {Array.from({ length: slots }).map((_, i) => {
          const itemId = assignments[i];
          const label = itemId ? map.get(itemId) ?? '—' : null;

          return (
            <Item
              key={`slot-${i}`}
              label={label ?? ''}
              revealed={false}
              onReveal={() => onRevealBySlot(i)}
              slot={i}
              totalSlots={slots}
            />
          );
        })}
      </div>
      <div className="item-track__edge" />
    </div>
  );
}
