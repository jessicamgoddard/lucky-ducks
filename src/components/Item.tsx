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
  const [delay] = useState(() => getRandomNumber(0, 2));
  const [bobDuration] = useState(() => getRandomNumber(0.7, 1));
  // Each duck's ripples run at their own pace and phase so they don't pulse in unison
  const [rippleDuration] = useState(() => 1.6 + Math.random() * 1.2);
  const [rippleDelay] = useState(() => -Math.random() * 2.8);
  // Derived each render (not stored) so ducks re-space when the pond resizes
  const top = getItemTop(slot, totalSlots);
  const style = {
    animationDelay: `${delay}s`,
    top: `${top}px`,
    ['--travel-duration']: `${travelDuration}s`,
    ['--bob-duration']: `${bobDuration}s`,
    ['--ripple-duration']: `${rippleDuration}s`,
    ['--ripple-delay']: `${rippleDelay}s`,
    // Where the duck sits when motion is turned off
    ['--rest-left']: `${((slot + 0.5) / totalSlots) * 100}%`,
  };

  return (
    <button
      className="item"
      style={style}
      onClick={onReveal}
      aria-label={`Duck ${slot + 1} of ${totalSlots}`}
    >
      {/* Water lapping over the base of the duck */}
      <span className="item__water" aria-hidden />
    </button>
  );
}
