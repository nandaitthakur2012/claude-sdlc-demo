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

  it('adds a task with a due date and resets the input', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.type(screen.getByLabelText('New task'), 'Pay rent');
    await user.type(screen.getByLabelText('Due date'), '2099-12-01');
    await user.click(screen.getByRole('button', { name: 'Add' }));
    expect(screen.getByText('Due 2099-12-01')).toBeInTheDocument();
    expect(screen.getByLabelText('Due date')).toHaveValue('');
    expect(screen.queryByText(/Overdue/)).not.toBeInTheDocument();
  });

  it('marks unfinished past-due tasks as overdue, not done ones', async () => {
    const user = userEvent.setup();
    localStorage.setItem(
      'taskflow.tasks',
      JSON.stringify([
        { id: '1', title: 'Late', done: false, createdAt: 1, dueDate: '2000-01-01' },
        { id: '2', title: 'Finished', done: true, createdAt: 2, dueDate: '2000-01-01' },
      ]),
    );
    render(<App />);
    expect(screen.getByText('Late').closest('li')).toHaveClass('overdue');
    expect(screen.getByText(/Due 2000-01-01 \(Overdue\)/)).toBeInTheDocument();
    expect(screen.getByText('Finished').closest('li')).not.toHaveClass('overdue');
    await user.click(screen.getAllByRole('checkbox')[0]);
    expect(screen.getByText('Late').closest('li')).not.toHaveClass('overdue');
  });

  it('loads legacy tasks without a due date', () => {
    localStorage.setItem(
      'taskflow.tasks',
      JSON.stringify([{ id: '1', title: 'Old', done: false, createdAt: 1 }]),
    );
    render(<App />);
    expect(screen.getByText('Old')).toBeInTheDocument();
    expect(screen.queryByText(/Due /)).not.toBeInTheDocument();
  });
});
