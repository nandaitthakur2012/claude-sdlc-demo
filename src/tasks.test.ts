import { addTask, countRemaining, deleteTask, filterTasks, toggleTask, type Task } from './tasks';

const sample: Task[] = [
  { id: 'a', title: 'Write code', done: false, createdAt: 1 },
  { id: 'b', title: 'Ship it', done: true, createdAt: 2 },
];

describe('tasks', () => {
  it('adds a trimmed task', () => {
    const result = addTask([], '  Buy milk  ');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Buy milk');
    expect(result[0].done).toBe(false);
  });

  it('ignores blank titles', () => {
    expect(addTask(sample, '   ')).toBe(sample);
  });

  it('toggles a task', () => {
    expect(toggleTask(sample, 'a')[0].done).toBe(true);
  });

  it('deletes a task', () => {
    expect(deleteTask(sample, 'a').map((t) => t.id)).toEqual(['b']);
  });

  it('filters tasks', () => {
    expect(filterTasks(sample, 'active').map((t) => t.id)).toEqual(['a']);
    expect(filterTasks(sample, 'done').map((t) => t.id)).toEqual(['b']);
    expect(filterTasks(sample, 'all')).toHaveLength(2);
  });

  it('counts remaining tasks', () => {
    expect(countRemaining(sample)).toBe(1);
  });
});
