import Item from './Item';
import type { Duck } from '../utils/pond';

import '../scss/components/_itemTrack.scss';

type Props = {
  ducks: Duck[];
  onPick: (duckId: string) => void;
};

/**
 * Component to display items on a track.
 */
export default function ItemTrack({ ducks, onPick }: Props) {
  const slots = ducks.length;

  return (
    <div className="item-track" aria-label="Duck pond">
      <div className="item-track__edge" />
      <div className="item-track__track" />

      <div className="item-track__items">
        {ducks.map((duck, i) => (
          <Item
            key={duck.id}
            label=""
            revealed={false}
            onReveal={() => onPick(duck.id)}
            slot={i}
            totalSlots={slots}
          />
        ))}
      </div>
      <div className="item-track__edge" />
    </div>
  );
}
