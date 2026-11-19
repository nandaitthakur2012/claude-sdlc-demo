import { useEffect, useState, type FormEvent } from 'react';
import {
  addTask,
  clearCompleted,
  countRemaining,
  deleteTask,
  filterTasks,
  isOverdue,
  toggleTask,
  type Filter,
  type Task,
} from './tasks';
import { loadTasks, saveTasks } from './storage';

const FILTERS: Filter[] = ['all', 'active', 'done'];

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks());
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => saveTasks(tasks), [tasks]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setTasks((prev) => addTask(prev, title, dueDate));
    setTitle('');
    setDueDate('');
  }

  const visible = filterTasks(tasks, filter);
  const remaining = countRemaining(tasks);
  const completed = tasks.length - remaining;

  return (
    <main className="app">
      <header>
        <h1>TaskFlow</h1>
        <p className="subtitle">Built and shipped by Claude + GitHub Actions</p>
      </header>

      <form onSubmit={onSubmit} className="add-form">
        <input
          aria-label="New task"
          placeholder="What needs doing?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="date"
          aria-label="Due date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      <nav className="filters" aria-label="Filter tasks">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={f === filter ? 'active' : ''}
            aria-pressed={f === filter}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </nav>

      <ul className="task-list">
        {visible.map((t) => {
          const overdue = isOverdue(t);
          const cls = [t.done ? 'done' : '', overdue ? 'overdue' : ''].filter(Boolean).join(' ');
          return (
            <li key={t.id} className={cls}>
              <label>
                <input
                  type="checkbox"
                  checked={t.done}
                  onChange={() => setTasks((p) => toggleTask(p, t.id))}
                />
                <span>{t.title}</span>
                {t.dueDate && (
                  <span className="due-date">
                    Due {t.dueDate}
                    {overdue && ' (Overdue)'}
                  </span>
                )}
              </label>
              <button
                className="delete"
                aria-label={`Delete ${t.title}`}
                onClick={() => setTasks((p) => deleteTask(p, t.id))}
              >
                ×
              </button>
            </li>
          );
        })}
        {visible.length === 0 && <li className="empty">Nothing here yet.</li>}
      </ul>

      <footer>
        <span>
          {remaining} {remaining === 1 ? 'task' : 'tasks'} remaining
        </span>
        <button
          className="clear-completed"
          disabled={completed === 0}
          onClick={() => setTasks((p) => clearCompleted(p))}
        >
          Clear completed
        </button>
      </footer>
    </main>
  );
}
