// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Reveal from './Reveal';

afterEach(cleanup);

describe('Reveal', () => {
  it('renders nothing without a label', () => {
    render(<Reveal label={null} onClose={vi.fn()} />);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('shows a dialog named by its heading and described by the result', () => {
    render(<Reveal heading="You picked:" label="Alice" onClose={vi.fn()} />);
    const dialog = screen.getByRole('dialog', { name: 'You picked:' });
    expect(dialog.getAttribute('aria-describedby')).toBe('reveal-label');
    expect(screen.getByText('Alice').id).toBe('reveal-label');
  });

  it('focuses Close and keeps focus there on Tab', async () => {
    const user = userEvent.setup();
    render(<Reveal label="Alice" onClose={vi.fn()} />);
    const close = screen.getByRole('button', { name: 'Close' });
    expect(document.activeElement).toBe(close);
    await user.tab();
    expect(document.activeElement).toBe(close);
  });

  it('closes on Escape, Close and the backdrop but not the card', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<Reveal label="Alice" onClose={onClose} />);
    await user.click(screen.getByText('Alice'));
    expect(onClose).not.toHaveBeenCalled();
    await user.keyboard('{Escape}');
    await user.click(screen.getByRole('button', { name: 'Close' }));
    await user.click(screen.getByRole('dialog').parentElement as HTMLElement);
    expect(onClose).toHaveBeenCalledTimes(3);
  });

  it('only shows confetti (hidden from screen readers) when celebrating', () => {
    const { container, rerender } = render(<Reveal label="Alice" celebrate onClose={vi.fn()} />);
    const confetti = container.querySelector('.reveal__confetti');
    expect(confetti?.getAttribute('aria-hidden')).toBe('true');
    expect(confetti?.children.length).toBeGreaterThan(0);
    rerender(<Reveal label="Alice" onClose={vi.fn()} />);
    expect(container.querySelector('.reveal__confetti')).toBeNull();
  });

  it('returns focus to the opener when it closes', () => {
    const opener = document.createElement('button');
    document.body.append(opener);
    opener.focus();
    const { rerender } = render(<Reveal label="Alice" onClose={vi.fn()} />);
    rerender(<Reveal label={null} onClose={vi.fn()} />);
    expect(document.activeElement).toBe(opener);
    opener.remove();
  });
});
