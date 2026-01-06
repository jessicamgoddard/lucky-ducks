import { useState } from 'react';

import '../scss/components/_item.scss';

type Props = {
  label: string;
  revealed: boolean;
  onReveal: () => void;
};

function getRandomNumber(min: number, max: number) {
  return Math.random() * (max - min + 1) + min;
}

/**
 * Component to display a single item.
 */
export default function Item({ label, revealed, onReveal }: Props) {
  const [speed] = useState(() => getRandomNumber(20, 40));
  const style = { animationDuration: `${speed}s` };
  
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
