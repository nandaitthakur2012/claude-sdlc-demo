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
});
