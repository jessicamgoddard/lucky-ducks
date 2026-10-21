import { useEffect, useRef, useState } from 'react';

import duckUrl from '../assets/rubber-duck-2.svg';
import { getRandomNumber } from '../utils/general';

import '../scss/components/_reveal.scss';

const CONFETTI_COLORS = ['#ffd23f', '#3aa0ff', '#ff6b9d', '#4cc38a', '#ff8c42'];
const CONFETTI_COUNT = 40;

type Props = {
  heading?: string;
  label: string | null;
  celebrate?: boolean;
  onClose: () => void;
};

/**
 * Reveal overlay: a duck lifts up and shows a card with what it was hiding.
 */
export default function Reveal({ heading = 'You picked:', label, celebrate = false, onClose }: Props) {
  // If no label, don't render anything
  if (!label) return null;

  return <RevealCard heading={heading} label={label} celebrate={celebrate} onClose={onClose} />;
}

type CardProps = Required<Omit<Props, 'label'>> & { label: string };

/**
 * The visible reveal. Mounted once per reveal so confetti and focus
 * handling start fresh each time.
 */
function RevealCard({ heading, label, celebrate, onClose }: CardProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  // Keep the latest onClose without re-running the focus effect on every render
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });
  const [confetti] = useState(() =>
    Array.from({ length: CONFETTI_COUNT }, (_, i) => ({
      id: i,
      style: {
        '--confetti-x': `${getRandomNumber(-45, 45)}vw`,
        '--confetti-rotate': `${getRandomNumber(-720, 720)}deg`,
        '--confetti-delay': `${getRandomNumber(0, 0.4)}s`,
        '--confetti-duration': `${getRandomNumber(1.6, 2.6)}s`,
        backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      } as React.CSSProperties,
    })),
  );

  // Move focus into the dialog, close on Escape, and hand focus back on exit
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current();
      // Close is the only control, so keep focus on it
      if (e.key === 'Tab') {
        e.preventDefault();
        closeRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      previous?.focus();
    };
  }, []);

  return (
    <div className="reveal" onClick={onClose}>
      {celebrate && (
        <div className="reveal__confetti" aria-hidden>
          {confetti.map((piece) => (
            <span key={piece.id} className="reveal__confetti-piece" style={piece.style} />
          ))}
        </div>
      )}

      <div
        className="reveal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reveal-heading"
        aria-describedby="reveal-label"
        onClick={(e) => e.stopPropagation()}
      >
        <img className="reveal__duck" src={duckUrl} alt="" />
        <div className="reveal__card">
          <h2 className="reveal__heading" id="reveal-heading">{heading}</h2>
          <p className="reveal__label" id="reveal-label">{label}</p>
          <button ref={closeRef} onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
