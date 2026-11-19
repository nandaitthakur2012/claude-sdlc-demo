// Pure task logic — kept UI-free so it is easy to unit test.

export interface Task {
  id: string;
  title: string;
  done: boolean;
  createdAt: number;
}

export type Filter = 'all' | 'active' | 'done';

export function createTask(title: string, now: number = Date.now()): Task {
  return {
    id: `${now}-${Math.random().toString(36).slice(2, 8)}`,
    title: title.trim(),
    done: false,
    createdAt: now,
  };
}

export function addTask(tasks: Task[], title: string): Task[] {
  if (!title.trim()) return tasks;
  return [...tasks, createTask(title)];
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

export function countRemaining(tasks: Task[]): number {
  return tasks.filter((t) => !t.done).length;
}
