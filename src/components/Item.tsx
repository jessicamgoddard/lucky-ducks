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
    <div
      className="track-item"
      style={style}
      onClick={onReveal}
      title="Click to reveal"
    >
      {revealed ? label : '❓'}
    </div>
  );
}
