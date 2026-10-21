// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { playPickSound } from './utils/sound';

// No real audio in tests; just record the calls
vi.mock('./utils/sound', () => ({ playPickSound: vi.fn() }));

const KEY = 'random-picker-items';

/** Seed saved options, render the app and return a user. */
function setup(labels: string[] = ['Alice', 'Bob']) {
  localStorage.setItem(KEY, JSON.stringify(labels.map((label, i) => ({ id: `id${i}`, label }))));
  render(<App />);
  return userEvent.setup();
}

const main = () => document.querySelector('main') as HTMLElement;
const status = () => screen.getByRole('status').textContent?.split(String.fromCharCode(160)).join('');

beforeEach(() => {
  localStorage.clear();
  vi.mocked(playPickSound).mockClear();
});
afterEach(cleanup);

describe('App', () => {
  it('disables Start and explains why when there are no options', () => {
    setup([]);
    const start = screen.getByRole('button', { name: 'Start' }) as HTMLButtonElement;
    expect(start.disabled).toBe(true);
    expect(start.getAttribute('aria-describedby')).toBe('start-hint');
    expect(screen.getByText('Add at least one option to start.').id).toBe('start-hint');
  });

  it('restores saved options and saves new ones', async () => {
    const user = setup();
    expect(screen.getByText('Alice')).toBeTruthy();
    await user.type(screen.getByRole('textbox', { name: 'New option' }), 'Cara{Enter}');
    expect(JSON.parse(localStorage.getItem(KEY) ?? '[]').map((i: { label: string }) => i.label)).toEqual(['Alice', 'Bob', 'Cara']);
  });

  it('announces changes in the live region', async () => {
    const user = setup();
    await user.click(screen.getByRole('button', { name: 'Delete Alice' }));
    expect(status()).toBe('Removed Alice. 1 option.');
    await user.click(screen.getByRole('button', { name: 'Clear All' }));
    expect(status()).toBe('All options cleared.');
  });

  it('starts the pond with a duck per option plus a decoy and focuses the prompt', async () => {
    const user = setup();
    await user.click(screen.getByRole('button', { name: 'Start' }));
    // Two options plus one decoy
    expect(screen.getAllByRole('button', { name: /^Duck \d of 3$/ })).toHaveLength(3);
    expect(screen.getByRole('group', { name: 'Duck pond' })).toBeTruthy();
    expect(document.activeElement).toBe(screen.getByRole('heading', { name: 'Pick a duck!' }));
  });

  it('reveals something when a duck is picked, then restores focus on close', async () => {
    const user = setup();
    await user.click(screen.getByRole('button', { name: 'Start' }));
    const duck = screen.getByRole('button', { name: 'Duck 1 of 3' });
    await user.click(duck);
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByRole('heading').textContent).toMatch(/You picked:|Quack!/);
    expect(main().hasAttribute('inert')).toBe(true);
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(main().hasAttribute('inert')).toBe(false);
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Duck 1 of 3' }));
  });

  it('plays the matching sound when a duck is picked', async () => {
    const user = setup();
    await user.click(screen.getByRole('button', { name: 'Start' }));
    await user.click(screen.getByRole('button', { name: 'Duck 1 of 3' }));
    expect(playPickSound).toHaveBeenCalledTimes(1);
    // A real option squeaks, a decoy quacks
    const heading = within(screen.getByRole('dialog')).getByRole('heading').textContent;
    expect(vi.mocked(playPickSound).mock.calls[0][0]).toBe(heading === 'Quack!' ? 'dud' : 'success');
  });

  it('opens settings, stays quiet with sounds off, and remembers the choice', async () => {
    const user = setup();
    await user.click(screen.getByRole('button', { name: 'Start' }));
    await user.click(screen.getByRole('button', { name: 'Settings' }));
    expect(main().hasAttribute('inert')).toBe(true);
    await user.click(screen.getByRole('checkbox', { name: /Sounds/ }));
    expect(JSON.parse(localStorage.getItem('random-picker-settings') ?? '{}').sounds).toBe(false);
    await user.click(screen.getByRole('button', { name: 'Done' }));
    expect(main().hasAttribute('inert')).toBe(false);
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Settings' }));
    await user.click(screen.getByRole('button', { name: 'Duck 1 of 3' }));
    expect(playPickSound).not.toHaveBeenCalled();
  });

  it('removes the decoys from the pond when they are switched off', async () => {
    const user = setup();
    await user.click(screen.getByRole('button', { name: 'Start' }));
    expect(screen.getAllByRole('button', { name: /^Duck \d of 3$/ })).toHaveLength(3);
    await user.click(screen.getByRole('button', { name: 'Settings' }));
    await user.click(screen.getByRole('checkbox', { name: /Decoy ducks/ }));
    await user.click(screen.getByRole('button', { name: 'Done' }));
    expect(screen.getAllByRole('button', { name: /^Duck \d of 2$/ })).toHaveLength(2);
  });

  it('edits options in a modal mid-game and resizes the pond', async () => {
    const user = setup();
    await user.click(screen.getByRole('button', { name: 'Start' }));
    await user.click(screen.getByRole('button', { name: 'Edit options' }));
    expect(main().hasAttribute('inert')).toBe(true);
    await user.type(screen.getByRole('textbox', { name: 'New option' }), 'Cara{Enter}');
    // Three options now get two decoys
    expect(screen.getAllByRole('button', { name: /^Duck \d of 5$/ })).toHaveLength(5);
    await user.click(screen.getByRole('button', { name: 'Done' }));
    expect(main().hasAttribute('inert')).toBe(false);
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Edit options' }));
  });

  it('confirms a reshuffle on the button and in the live region', async () => {
    const user = setup();
    await user.click(screen.getByRole('button', { name: 'Start' }));
    await user.click(screen.getByRole('button', { name: 'Reshuffle' }));
    expect(screen.getByRole('button', { name: 'Shuffled!' })).toBeTruthy();
    expect(status()).toBe('Ducks reshuffled.');
  });

  it('toggles the pause label and the paused class', async () => {
    const user = setup();
    await user.click(screen.getByRole('button', { name: 'Start' }));
    await user.click(screen.getByRole('button', { name: 'Pause ducks' }));
    expect(main().classList.contains('is-paused')).toBe(true);
    await user.click(screen.getByRole('button', { name: 'Start ducks' }));
    expect(main().classList.contains('is-paused')).toBe(false);
  });

  it('goes back to setup and focuses its heading', async () => {
    const user = setup();
    await user.click(screen.getByRole('button', { name: 'Start' }));
    await user.click(screen.getByRole('button', { name: 'Back to setup' }));
    expect(screen.queryByRole('group', { name: 'Duck pond' })).toBeNull();
    expect(document.activeElement).toBe(screen.getByRole('heading', { name: 'Add your options' }));
  });

  it('survives corrupt saved data', () => {
    localStorage.setItem(KEY, 'null');
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Add your options' })).toBeTruthy();
  });
});
