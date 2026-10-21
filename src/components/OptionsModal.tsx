import { useEffect, useRef, type ReactNode } from 'react';

import '../scss/components/_optionsModal.scss';

type Props = {
  // Dialog title; defaults to the options editor
  heading?: string;
  onClose: () => void;
  children: ReactNode;
};

const FOCUSABLE = 'button:not(:disabled), input:not(:disabled), [href], [tabindex]:not([tabindex="-1"])';

/**
 * Dialog for editing the options while the ducks are in the pond. Also used
 * for the settings panel, via the heading prop.
 */
export default function OptionsModal({ heading = 'Edit options', onClose, children }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Move focus into the dialog and hand it back to the opener on exit
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    dialogRef.current?.querySelector<HTMLElement>('input')?.focus();

    return () => previous?.focus();
  }, []);

  // Close on Escape and keep Tab inside the dialog. Controls inside can stop
  // propagation (e.g. Escape while renaming an item) to handle the key themselves.
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
      return;
    }

    if (e.key !== 'Tab') return;

    const focusable = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <div className="options-modal" onClick={onClose}>
      <div
        ref={dialogRef}
        className="options-modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="options-modal-heading"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <button className="options-modal__close" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden focusable="false">
            <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </button>
        <h2 className="options-modal__heading" id="options-modal-heading">{heading}</h2>
        {children}
        <div className="options-modal__footer">
          <button className="button--primary" onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  );
}
