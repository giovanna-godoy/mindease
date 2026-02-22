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
      { id: '1', status: 'todo', title: 'Task 1' } as any,
      { id: '2', status: 'in_progress', title: 'Task 2' } as any,
      { id: '3', status: 'todo', title: 'Task 3' } as any
    ];

    const result = pipe.transform(tasks, 'todo');
    expect(result.length).toBe(2);
    expect(result[0].id).toBe('1');
    expect(result[1].id).toBe('3');
  });

  it('should return empty array when no tasks match', () => {
    const tasks = [
      { id: '1', status: 'todo', title: 'Task 1' } as any
    ];

    const result = pipe.transform(tasks, 'done');
    expect(result.length).toBe(0);
  });

  it('should return empty array when tasks is null', () => {
    const result = pipe.transform(null as any, 'todo');
    expect(result.length).toBe(0);
  });
});
