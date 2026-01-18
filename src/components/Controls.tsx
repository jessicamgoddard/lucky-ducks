type Props = {
  onClear: () => void;
  onShuffle: () => void;
};

/**
 * Controls component with a clear all button.
 */
export default function Controls({ onClear, onShuffle }: Props) {
  return (
    <div className="control-bar">
      <button onClick={onShuffle}>Shuffle / Reassign</button>
      <button onClick={onClear}>Clear All Items</button>
    </div>
  );
}
