import { useEffect, useState, type FormEvent } from 'react';
import {
  addTask,
  countRemaining,
  deleteTask,
  filterTasks,
  toggleTask,
  type Filter,
  type Task,
} from './tasks';
import { loadTasks, saveTasks } from './storage';

const FILTERS: Filter[] = ['all', 'active', 'done'];

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks());
  const [title, setTitle] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => saveTasks(tasks), [tasks]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setTasks((prev) => addTask(prev, title));
    setTitle('');
  }

  const visible = filterTasks(tasks, filter);
  const remaining = countRemaining(tasks);

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
        {visible.map((t) => (
          <li key={t.id} className={t.done ? 'done' : ''}>
            <label>
              <input
                type="checkbox"
                checked={t.done}
                onChange={() => setTasks((p) => toggleTask(p, t.id))}
              />
              <span>{t.title}</span>
            </label>
            <button
              className="delete"
              aria-label={`Delete ${t.title}`}
              onClick={() => setTasks((p) => deleteTask(p, t.id))}
            >
              ×
            </button>
          </li>
        ))}
        {visible.length === 0 && <li className="empty">Nothing here yet.</li>}
      </ul>

      <footer>
        {remaining} {remaining === 1 ? 'task' : 'tasks'} remaining
      </footer>
    </main>
  );
}
