// Pure task logic — kept UI-free so it is easy to unit test.

export interface Task {
  id: string;
  title: string;
  done: boolean;
  createdAt: number;
  dueDate?: string | null;
}

export type Filter = 'all' | 'active' | 'done';

export function createTask(
  title: string,
  now: number = Date.now(),
  dueDate?: string | null,
): Task {
  return {
    id: `${now}-${Math.random().toString(36).slice(2, 8)}`,
    title: title.trim(),
    done: false,
    createdAt: now,
    dueDate: dueDate?.trim() || null,
  };
}

export function addTask(tasks: Task[], title: string, dueDate?: string | null): Task[] {
  if (!title.trim()) return tasks;
  return [...tasks, createTask(title, Date.now(), dueDate)];
}

function localDateString(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

export function isOverdue(task: Task, today: Date = new Date()): boolean {
  return !task.done && !!task.dueDate && task.dueDate < localDateString(today);
}

export function toggleTask(tasks: Task[], id: string): Task[] {
  return tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
}

export function deleteTask(tasks: Task[], id: string): Task[] {
  return tasks.filter((t) => t.id !== id);
}

export function filterTasks(tasks: Task[], filter: Filter): Task[] {
  if (filter === 'active') return tasks.filter((t) => !t.done);
  if (filter === 'done') return tasks.filter((t) => t.done);
  return tasks;
}

export function clearCompleted(tasks: Task[]): Task[] {
  return tasks.filter((t) => !t.done);
}

export function countRemaining(tasks: Task[]): number {
  return tasks.filter((t) => !t.done).length;
}
