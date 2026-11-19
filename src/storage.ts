import type { Task } from './tasks';

const KEY = 'taskflow.tasks';

export function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return (parsed as Task[]).map((t) => ({ ...t, dueDate: t.dueDate ?? null }));
  } catch {
    return [];
  }
}

export function saveTasks(tasks: Task[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(tasks));
  } catch {
    // storage unavailable (private mode etc.) — app still works in memory
  }
}
