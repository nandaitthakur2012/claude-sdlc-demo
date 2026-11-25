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

export type Theme = 'light' | 'dark';

const THEME_KEY = 'taskflow.theme';

export function loadTheme(): Theme | null {
  try {
    const raw = localStorage.getItem(THEME_KEY);
    return raw === 'light' || raw === 'dark' ? raw : null;
  } catch {
    return null;
  }
}

export function saveTheme(theme: Theme): void {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // storage unavailable: theme still applies for this session
  }
}
