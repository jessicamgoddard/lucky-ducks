// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OptionsModal from './OptionsModal';

afterEach(cleanup);

/** Renders the modal with an input and a button as its content. */
function setup() {
  const onClose = vi.fn();
  render(
    <OptionsModal onClose={onClose}>
      <input aria-label="Field" />
      <button>Inner</button>
    </OptionsModal>,
  );
  return { onClose, user: userEvent.setup() };
}

describe('OptionsModal', () => {
  it('is a labelled modal dialog', () => {
    setup();
    const dialog = screen.getByRole('dialog', { name: 'Edit options' });
    expect(dialog.getAttribute('aria-modal')).toBe('true');
  });

  it('moves focus to the first input on open', () => {
    setup();
    expect(document.activeElement).toBe(screen.getByRole('textbox', { name: 'Field' }));
  });

  it('closes on Escape, the X button, Done and the backdrop', async () => {
    const { user, onClose } = setup();
    await user.keyboard('{Escape}');
    await user.click(screen.getByRole('button', { name: 'Close' }));
    await user.click(screen.getByRole('button', { name: 'Done' }));
    expect(onClose).toHaveBeenCalledTimes(3);
    await user.click(screen.getByRole('dialog').parentElement as HTMLElement);
    expect(onClose).toHaveBeenCalledTimes(4);
  });

  it('does not close when clicking inside the dialog', async () => {
    const { user, onClose } = setup();
    await user.click(screen.getByRole('button', { name: 'Inner' }));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('cycles Tab and Shift+Tab inside the dialog', async () => {
    const { user } = setup();
    const close = screen.getByRole('button', { name: 'Close' });
    const done = screen.getByRole('button', { name: 'Done' });
    close.focus();
    await user.tab({ shift: true });
    expect(document.activeElement).toBe(done);
    await user.tab();
    expect(document.activeElement).toBe(close);
  });

  it('hands focus back to the opener when it unmounts', () => {
    const opener = document.createElement('button');
    document.body.append(opener);
    opener.focus();
    const { unmount } = render(<OptionsModal onClose={vi.fn()}><input aria-label="Field" /></OptionsModal>);
    expect(document.activeElement).not.toBe(opener);
    unmount();
    expect(document.activeElement).toBe(opener);
    opener.remove();
  });
});
