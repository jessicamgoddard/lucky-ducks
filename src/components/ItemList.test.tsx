// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ItemList from './ItemList';
import type { PickerItem } from '../utils/storage';

afterEach(cleanup);

const ITEMS: PickerItem[] = [
  { id: 'a', label: 'Alice' },
  { id: 'b', label: 'Bob' },
];

/** Renders the list with spies for each callback. */
function setup(items: PickerItem[] = ITEMS) {
  const handlers = { onAdd: vi.fn(), onClear: vi.fn(), onDelete: vi.fn(), onUpdate: vi.fn() };
  render(<ItemList items={items} {...handlers} />);
  return { ...handlers, user: userEvent.setup() };
}

describe('ItemList', () => {
  it('names the repeated buttons after their option', () => {
    setup();
    expect(screen.getByRole('button', { name: 'Edit Alice' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Delete Bob' })).toBeTruthy();
  });

  it('adds a trimmed option with Enter and refocuses the field', async () => {
    const { user, onAdd } = setup();
    const input = screen.getByRole('textbox', { name: 'New option' });
    await user.type(input, '  Cara  {Enter}');
    expect(onAdd).toHaveBeenCalledWith('Cara');
    expect((input as HTMLInputElement).value).toBe('');
    expect(document.activeElement).toBe(input);
  });

  it('ignores blank input but keeps focus in the field', async () => {
    const { user, onAdd } = setup();
    await user.click(screen.getByRole('button', { name: 'Add' }));
    expect(onAdd).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(screen.getByRole('textbox', { name: 'New option' }));
  });

  it('disables Clear All when there are no options', () => {
    setup([]);
    expect((screen.getByRole('button', { name: 'Clear All' }) as HTMLButtonElement).disabled).toBe(true);
  });

  it('deletes an option and returns focus to the add field', async () => {
    const { user, onDelete } = setup();
    await user.click(screen.getByRole('button', { name: 'Delete Alice' }));
    expect(onDelete).toHaveBeenCalledWith('a');
    expect(document.activeElement).toBe(screen.getByRole('textbox', { name: 'New option' }));
  });

  it('renames with Enter and returns focus to that option\'s Edit button', async () => {
    const { user, onUpdate } = setup();
    await user.click(screen.getByRole('button', { name: 'Edit Alice' }));
    const field = screen.getByRole('textbox', { name: 'Edit Alice' });
    expect(document.activeElement).toBe(field);
    await user.clear(field);
    await user.type(field, 'Alicia{Enter}');
    expect(onUpdate).toHaveBeenCalledWith('a', 'Alicia');
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Edit Alice' }));
  });

  it('cancels a rename with Escape without saving or bubbling', async () => {
    const onParentKey = vi.fn();
    const onUpdate = vi.fn();
    const user = userEvent.setup();
    render(
      <div onKeyDown={onParentKey}>
        <ItemList items={ITEMS} onAdd={vi.fn()} onClear={vi.fn()} onDelete={vi.fn()} onUpdate={onUpdate} />
      </div>,
    );
    await user.click(screen.getByRole('button', { name: 'Edit Alice' }));
    await user.keyboard('xyz{Escape}');
    expect(onUpdate).not.toHaveBeenCalled();
    expect(onParentKey).not.toHaveBeenCalledWith(expect.objectContaining({ key: 'Escape' }));
    expect(screen.getByRole('button', { name: 'Edit Alice' })).toBeTruthy();
  });

  it('does not save an empty rename', async () => {
    const { user, onUpdate } = setup();
    await user.click(screen.getByRole('button', { name: 'Edit Bob' }));
    await user.clear(screen.getByRole('textbox', { name: 'Edit Bob' }));
    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(onUpdate).not.toHaveBeenCalled();
  });

  it('clears everything and refocuses the field', async () => {
    const { user, onClear } = setup();
    await user.click(screen.getByRole('button', { name: 'Clear All' }));
    expect(onClear).toHaveBeenCalled();
    expect(document.activeElement).toBe(screen.getByRole('textbox', { name: 'New option' }));
  });
});

