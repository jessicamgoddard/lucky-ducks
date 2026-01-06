import { useState } from 'react';

import '../scss/components/_item.scss';

type Props = {
  label: string;
  revealed: boolean;
  onReveal: () => void;
  slot: number;
  totalSlots: number;
};

/**
 * Generate a random number between min and max (inclusive).
 */
function getRandomNumber(min: number, max: number) {
  return Math.random() * (max - min + 1) + min;
}

/**
 * Calculate top position for an item based on its slot position and total number of slots.
 */
function getItemTop(slot: number, totalSlots: number) {
  const spacePerItem = 60 / totalSlots;

 return slot * spacePerItem;
}

/**
 * Component to display a single item.
 */
export default function Item({ label, revealed, onReveal, slot, totalSlots }: Props) {
  const [speed] = useState(() => getRandomNumber(20, 40));
  const [delay] = useState(() => getRandomNumber(0, 2));
  const [top] = useState(() => getItemTop(slot, totalSlots));
  const style = { animationDuration: `${speed}s`, animationDelay: `${delay}s`, top: `${top}px` };
  
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
