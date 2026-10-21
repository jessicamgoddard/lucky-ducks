import { useState } from 'react';

import { getRandomNumber, getItemTop } from '../utils/general';

import '../scss/components/_item.scss';

type Props = {
  onReveal: () => void;
  slot: number;
  totalSlots: number;
};

/**
 * Component to display a single duck.
 */
export default function Item({ onReveal, slot, totalSlots }: Props) {
  const [travelDuration] = useState(() => getRandomNumber(5, 10));
  // How far along its trip the duck starts, so ducks begin spread across the pond
  const [startOffset] = useState(() => Math.random());
  const [bobDuration] = useState(() => getRandomNumber(0.7, 1));
  // Derived each render (not stored) so ducks re-space when the pond resizes
  const top = getItemTop(slot, totalSlots);
  const style = {
    top: `${top}px`,
    ['--travel-duration']: `${travelDuration}s`,
    ['--bob-duration']: `${bobDuration}s`,
    ['--start-offset']: startOffset,
    // Where the duck sits when motion is turned off
    ['--rest-left']: `${((slot + 0.5) / totalSlots) * 100}%`,
  };

  return (
    <button
      className="item"
      style={style}
      onClick={onReveal}
      aria-label={`Duck ${slot + 1} of ${totalSlots}`}
    />
  );
}
