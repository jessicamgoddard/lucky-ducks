type Props = {
  label: string;
  revealed: boolean;
  onReveal: () => void;
  style: React.CSSProperties;
};

/**
 * Component to display a single item.
 */
export default function Item({ label, revealed, onReveal, style }: Props) {
  return (
    <button
      className="track-item"
      style={style}
      onClick={onReveal}
      title="Click to reveal"
      aria-label={revealed ? `Revealed: ${label}` : 'Hidden item — click to reveal'}
    >
      {revealed ? label : '❓'}
    </button>
  );
}
