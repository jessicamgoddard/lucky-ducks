type Props = {
  onClear: () => void;
};

/**
 * Controls component with a clear all button.
 */
export default function Controls({ onClear }: Props) {
  return (
    <div className="controls">
      <button onClick={onClear}>Clear All Items</button>
    </div>
  );
}
