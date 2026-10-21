import Item from './Item';
import type { Duck } from '../utils/pond';

import '../scss/components/_itemTrack.scss';

type Props = {
  ducks: Duck[];
  onPick: (duckId: string) => void;
  shuffleCount: number;
};

/**
 * Component to display items on a track.
 */
export default function ItemTrack({ ducks, onPick, shuffleCount }: Props) {
  const slots = ducks.length;

  return (
    <div className="item-track" role="group" aria-label="Duck pond">
      <div className="item-track__edge" />
      <div className="item-track__track" />

      <div className="item-track__items">
        {ducks.map((duck, i) => (
          <Item
            key={duck.id}
            onReveal={() => onPick(duck.id)}
            shuffleCount={shuffleCount}
            slot={i}
            totalSlots={slots}
          />
        ))}
      </div>
      <div className="item-track__edge" />
    </div>
  );
}
