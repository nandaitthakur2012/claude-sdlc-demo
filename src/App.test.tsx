import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

beforeEach(() => localStorage.clear());

describe('App', () => {
  it('adds, completes and deletes a task', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText('New task'), 'Demo the pipeline');
    await user.click(screen.getByRole('button', { name: 'Add' }));
    expect(screen.getByText('Demo the pipeline')).toBeInTheDocument();
    expect(screen.getByText('1 task remaining')).toBeInTheDocument();

    await user.click(screen.getByRole('checkbox'));
    expect(screen.getByText('0 tasks remaining')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Delete Demo the pipeline' }));
    expect(screen.queryByText('Demo the pipeline')).not.toBeInTheDocument();
  });

  it('clears completed tasks', async () => {
    const user = userEvent.setup();
    render(<App />);
    const clear = screen.getByRole('button', { name: 'Clear completed' });
    expect(clear).toBeDisabled();

    for (const t of ['Keep me', 'Finish me']) {
      await user.type(screen.getByLabelText('New task'), t);
      await user.click(screen.getByRole('button', { name: 'Add' }));
    }
    expect(clear).toBeDisabled();

    await user.click(screen.getAllByRole('checkbox')[1]);
    expect(clear).toBeEnabled();
    await user.click(clear);

    expect(screen.queryByText('Finish me')).not.toBeInTheDocument();
    expect(screen.getByText('Keep me')).toBeInTheDocument();
    expect(clear).toBeDisabled();
    const raw = localStorage.getItem(localStorage.key(0) ?? '') ?? '[]';
    const saved: { title: string }[] = JSON.parse(raw);
    expect(saved).toHaveLength(1);
    expect(saved[0].title).toBe('Keep me');
  });
});
