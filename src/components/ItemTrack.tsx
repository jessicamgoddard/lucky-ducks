import Item from './Item';
import type { PickerItem } from '../utils/storage';
import { useState } from 'react';

type Props = {
  items: PickerItem[];
};

/**
 * Component to display items arranged in a circular track.
 */
export default function ItemTrack({ items }: Props) {
  // State to track revealed items
  const [revealedIds, setRevealedIds] = useState<string[]>([]);

  const radius = 120; // distance from center
  const center = 150; // track is 300x300

  // Handle revealing an item
  const reveal = (id: string) => {
    // Add to revealed IDs if not already revealed
    if (!revealedIds.includes(id)) {
      setRevealedIds([...revealedIds, id]);
    }
  };

  return (
    <div className="item-track">
      <div className="track-ring" />

      <div className="rotating-layer">
        {items.map((item, i) => {
          const angle = (i / items.length) * Math.PI * 2;
          const x = center + radius * Math.cos(angle) - 30; // minus half width
          const y = center + radius * Math.sin(angle) - 30;

          return (
            <Item
              key={item.id}
              label={item.label}
              revealed={revealedIds.includes(item.id)}
              onReveal={() => reveal(item.id)}
              style={{ left: x, top: y, position: 'absolute' }}
            />
          );
        })}
      </div>
    </div>
  );
}
