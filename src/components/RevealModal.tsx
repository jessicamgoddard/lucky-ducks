import '../scss/components/_revealModal.scss';

type Props = {
  heading?: string;
  label: string | null;
  onClose: () => void;
};

export default function RevealModal({ heading = 'You picked:', label, onClose }: Props) {
  // If no label, don't render anything
  if (!label) return null;

  return (
    <div
      className="reveal-modal"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      onKeyDown={(e) => (e.key === 'Escape' ? onClose() : null)}
      tabIndex={0}
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.35)',
        zIndex: 9999,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          minWidth: 260,
          background: '#fff',
          padding: '1.25rem',
          borderRadius: 12,
          textAlign: 'center',
          boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
        }}
      >
        <h2 style={{ marginTop: 0 }}>{heading}</h2>
        <div style={{ fontSize: '1.4rem', fontWeight: 600 }}>{label}</div>
        <div style={{ marginTop: '1rem' }}>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
