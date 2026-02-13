import { FilterPipe } from './filter.pipe';

describe('FilterPipe', () => {
  let pipe: FilterPipe;

  beforeEach(() => {
    pipe = new FilterPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should filter tasks by status', () => {
    const tasks = [
      { id: '1', status: 'todo', title: 'Task 1' },
      { id: '2', status: 'in_progress', title: 'Task 2' },
      { id: '3', status: 'todo', title: 'Task 3' }
    ];

    const result = pipe.transform(tasks, 'todo');
    expect(result.length).toBe(2);
    expect(result[0].id).toBe('1');
    expect(result[1].id).toBe('3');
  });

  it('should return empty array for null input', () => {
    const result = pipe.transform(null, 'todo');
    expect(result).toEqual([]);
  });

  it('should return all tasks when no status provided', () => {
    const tasks = [
      { id: '1', status: 'todo', title: 'Task 1' },
      { id: '2', status: 'in_progress', title: 'Task 2' }
    ];

    const result = pipe.transform(tasks, '');
    expect(result.length).toBe(2);
  });
});