import { useState } from 'react';

import { getRandomNumber, getItemTop } from '../utils/general';

import '../scss/components/_item.scss';

type Props = {
  onReveal: () => void;
  // Increases each time the pond is reshuffled on request
  shuffleCount: number;
  slot: number;
  totalSlots: number;
};

/**
 * Component to display a single duck.
 */
export default function Item({ onReveal, shuffleCount, slot, totalSlots }: Props) {
  const [travelDuration] = useState(() => getRandomNumber(5, 10));
  // How far along its trip the duck starts, so ducks begin spread across the pond
  const [startOffset] = useState(() => Math.random());
  const [bobDuration] = useState(() => getRandomNumber(0.7, 1));
  // Each duck's ripples run at their own pace and phase so they don't pulse in unison
  const [rippleDuration] = useState(() => 1.6 + Math.random() * 1.2);
  const [rippleDelay] = useState(() => -Math.random() * 2.8);
  // Stagger the hop so ducks don't all jump at once. A duck that joins after
  // some shuffles has nothing to react to until the next one.
  const [shuffleDelay] = useState(() => Math.random() * 0.35);
  const [mountedAtCount] = useState(shuffleCount);
  // Alternating a/b restarts the CSS animation on every shuffle
  const shuffleState = shuffleCount === mountedAtCount ? undefined : shuffleCount % 2 ? 'a' : 'b';
  // Derived each render (not stored) so ducks re-space when the pond resizes
  const top = getItemTop(slot, totalSlots);
  const style = {
    top: `${top}px`,
    ['--travel-duration']: `${travelDuration}s`,
    ['--bob-duration']: `${bobDuration}s`,
    ['--ripple-duration']: `${rippleDuration}s`,
    ['--ripple-delay']: `${rippleDelay}s`,
    ['--shuffle-delay']: `${shuffleDelay}s`,
    ['--start-offset']: startOffset,
    // Where the duck sits when motion is turned off
    ['--rest-left']: `${((slot + 0.5) / totalSlots) * 100}%`,
  };

  return (
    <button
      className="item"
      data-shuffle={shuffleState}
      style={style}
      onClick={onReveal}
      aria-label={`Duck ${slot + 1} of ${totalSlots}`}
    >
      {/* Water lapping over the base of the duck */}
      <span className="item__water" aria-hidden />
    </button>
  );
}
