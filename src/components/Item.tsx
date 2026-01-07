import { useState } from 'react';

import { getRandomNumber, getItemTop } from '../utils/general';

import '../scss/components/_item.scss';

type Props = {
  label: string;
  revealed: boolean;
  onReveal: () => void;
  slot: number;
  totalSlots: number;
};

/**
 * Component to display a single item.
 */
export default function Item({ label, revealed, onReveal, slot, totalSlots }: Props) {
  const [travelDuration] = useState(() => getRandomNumber(5, 10));
  const [delay] = useState(() => getRandomNumber(0, 2));
  const [top] = useState(() => getItemTop(slot, totalSlots));
  const [bobDuration] = useState(() => getRandomNumber(0.7, 1));
  const style = {
    animationDelay: `${delay}s`,
    top: `${top}px`,
    ['--travel-duration']: `${travelDuration}s`,
    ['--bob-duration']: `${bobDuration}s`,
  };
  
  return (
    <button
      className="item"
      style={style}
      onClick={onReveal}
      title="Click to reveal"
      aria-label={revealed ? `Revealed: ${label}` : 'Hidden item — click to reveal'}
    />
  );
}
