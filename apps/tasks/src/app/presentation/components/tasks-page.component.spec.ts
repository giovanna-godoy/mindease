// Mock Angular modules and local imports to allow instantiating the class without the Angular linker/JIT
jest.mock('@angular/common', () => ({ CommonModule: {} }));
jest.mock('@angular/forms', () => ({ FormsModule: {} }));
jest.mock('@angular/material/icon', () => ({ MatIconModule: {} }));
jest.mock('../pipes/filter.pipe', () => ({ FilterPipe: {} }));
jest.mock('./task-form-dialog.component', () => ({ TaskFormDialogComponent: {} }));
jest.mock('@angular/router', () => ({ Router: function Router() {}, NavigationEnd: function NavigationEnd() {} }));

import { TasksPageComponent, Task, Subtask } from './tasks-page.component';

describe('TasksPageComponent (unit)', () => {
  let component: TasksPageComponent;
  const mockRouter: any = { events: { subscribe: () => ({ unsubscribe: () => {} }) } };
  const mockCdr: any = { markForCheck: jest.fn() };

  beforeEach(() => {
    component = new TasksPageComponent(mockRouter as any, mockCdr as any);
    // reset DOM event listeners
    (global as any).window = (global as any).window || {};
    (global as any).window.dispatchEvent = jest.fn();
  });

  test('getPriorityColor returns correct colors', () => {
    expect(component.getPriorityColor('high')).toBe('#EF4444');
    expect(component.getPriorityColor('medium')).toBe('#F59E0B');
    expect(component.getPriorityColor('low')).toBe('#3B82F6');
    expect(component.getPriorityColor('other')).toBe('#6B7280');
  });

  test('subtasks helpers', () => {
    const task: Task = { id: 't1', title: 't', description: '', status: 'todo', priority: 'low', estimatedTime: 0, subtasks: [{ id: 's1', title: 's', completed: true }], tags: [] };
    expect(component.getTotalSubtasks(task)).toBe(1);
    expect(component.getCompletedSubtasks(task)).toBe(1);
  });

  test('showAddSubtask and cancelAddSubtask update state', () => {
    component.showAddSubtask('abc');
    expect(component.addingSubtaskFor).toBe('abc');
    component.cancelAddSubtask();
    expect(component.addingSubtaskFor).toBeNull();
  });

  test('getTaskCountByStatus counts correctly', () => {
    component.tasks = [
      { id: '1', title: 'a', description: '', status: 'todo', priority: 'low', estimatedTime: 0, subtasks: [], tags: [] },
      { id: '2', title: 'b', description: '', status: 'in_progress', priority: 'low', estimatedTime: 0, subtasks: [], tags: [] },
    ];
    expect(component.getTaskCountByStatus('todo')).toBe(1);
    expect(component.getTaskCountByStatus('in_progress')).toBe(1);
    expect(component.getTaskCountByStatus('done')).toBe(0);
  });

  test('addSubtask does nothing when newSubtaskTitle empty', async () => {
    const task: Task = { id: '1', title: 'a', description: '', status: 'todo', priority: 'low', estimatedTime: 0, subtasks: [], tags: [] };
    component.tasks = [task];
    component.newSubtaskTitle = '   ';
    await component.addSubtask(task);
    expect(component.tasks[0].subtasks?.length).toBe(0);
  });

  test('addSubtask adds subtask and calls firebase saveTask', async () => {
    const task: Task = { id: '1', title: 'a', description: '', status: 'todo', priority: 'low', estimatedTime: 0, subtasks: [], tags: [] };
    component.tasks = [task];
    component.newSubtaskTitle = 'New Sub';

    const saveTask = jest.fn().mockResolvedValue(true);
    const getCurrentUser = jest.fn().mockReturnValue({ uid: 'u1' });

    (global as any).window.firebaseService = { saveTask, getCurrentUser };
    jest.spyOn(component, 'loadTasks').mockImplementation(async () => {});

    await component.addSubtask(task);

    expect(saveTask).toHaveBeenCalled();
    expect(component.newSubtaskTitle).toBe('');
  });

  test('toggleTaskStatus cycles status and calls saveTask when user present', async () => {
    const t: Task = { id: 't1', title: 'x', description: '', status: 'todo', priority: 'low', estimatedTime: 0, subtasks: [], tags: [] };
    component.tasks = [t];

    const saveTask = jest.fn().mockResolvedValue(true);
    (global as any).window.firebaseService = { saveTask, getCurrentUser: () => ({ uid: 'u1' }) };
    jest.spyOn(component, 'loadTasks').mockImplementation(async () => {});

    await component.toggleTaskStatus(t);

    expect(saveTask).toHaveBeenCalled();
    expect(component.tasks[0].status).not.toBe('todo');
  });

  test('deleteTask handles missing user by clearing deletingTaskId', async () => {
    const t: Task = { id: 't1', title: 'x', description: '', status: 'todo', priority: 'low', estimatedTime: 0, subtasks: [], tags: [] };
    component.tasks = [t];
    (global as any).window.firebaseService = { getCurrentUser: () => null };

    await component.deleteTask(t, undefined as any);
    expect(component.deletingTaskId).toBeNull();
  });

  test('getPriorityColor default case', () => {
    // already covered earlier but keep to ensure branch
    expect(component.getPriorityColor('')).toBe('#6B7280');
  });

  test('loadTasks sets tasks when firebase returns tasks', async () => {
    const tasksMock = [{ id: 'a', title: 'A', description: '', status: 'todo', priority: 'low', estimatedTime: 0, subtasks: [], tags: [] }];
    const waitForUser = jest.fn().mockResolvedValue({ uid: 'u1', email: 'e' });
    const getUserTasks = jest.fn().mockResolvedValue(tasksMock);
    (global as any).window.firebaseService = { waitForUser, getUserTasks };

    await component.loadTasks();
    expect(component.tasks).toEqual(tasksMock);
  });

  test('loadTasks handles errors and sets tasks empty', async () => {
    const waitForUser = jest.fn().mockResolvedValue({ uid: 'u1' });
    const getUserTasks = jest.fn().mockRejectedValue(new Error('fail'));
    (global as any).window.firebaseService = { waitForUser, getUserTasks };

    await component.loadTasks();
    expect(component.tasks).toEqual([]);
  });

  test('saveTasks calls firebase.saveTasks when user present', async () => {
    component.tasks = [{ id: '1', title: 't', description: '', status: 'todo', priority: 'low', estimatedTime: 0, subtasks: [], tags: [] }];
    const saveTasks = jest.fn().mockResolvedValue(true);
    const getCurrentUser = jest.fn().mockReturnValue({ uid: 'u1', email: 'e' });
    (global as any).window.firebaseService = { saveTasks, getCurrentUser };

    await component.saveTasks();
    expect(saveTasks).toHaveBeenCalledWith('u1', component.tasks);
  });

  test('refreshTasks calls loadTasks and showSuccessMessage', async () => {
    const loadSpy = jest.spyOn(component, 'loadTasks').mockImplementation(async () => {});
    (component as any).showSuccessMessage = jest.fn();
    await component.refreshTasks();
    expect(loadSpy).toHaveBeenCalled();
    expect((component as any).showSuccessMessage).toHaveBeenCalled();
  });

  test('onTaskSubmit shows error when no user', async () => {
    (global as any).window.firebaseService = { getCurrentUser: () => null };
    (component as any).showErrorMessage = jest.fn();
    await component.onTaskSubmit({ title: 't' } as any);
    expect((component as any).showErrorMessage).toHaveBeenCalled();
  });

  test('onTaskSubmit creates new task when no dialogTask', async () => {
    const saveTask = jest.fn().mockResolvedValue('newId');
    const getCurrentUser = jest.fn().mockReturnValue({ uid: 'u1' });
    (global as any).window.firebaseService = { saveTask, getCurrentUser };
    jest.spyOn(component, 'loadTasks').mockImplementation(async () => {});
    (component as any).showSuccessMessage = jest.fn();

    await component.onTaskSubmit({ title: 'Task', description: '' } as any);
    expect(saveTask).toHaveBeenCalled();
    expect((component as any).showSuccessMessage).toHaveBeenCalled();
  });

  test('onDrop moves task and triggers cognitive alerts when needed', async () => {
    const task: Task = { id: 't1', title: 'x', description: '', status: 'todo', priority: 'low', estimatedTime: 0, subtasks: [], tags: [] };
    component.draggedTask = task;
    component.tasks = [task];

    const saveTask = jest.fn().mockResolvedValue(true);
    const getCurrentUser = jest.fn().mockReturnValue({ uid: 'u1' });
    const cognitiveAlerts = { startTaskTracking: jest.fn(), stopTaskTracking: jest.fn() };
    (global as any).window.firebaseService = { saveTask, getCurrentUser };
    (global as any).window.cognitiveAlertsService = cognitiveAlerts;
    jest.spyOn(component, 'loadTasks').mockImplementation(async () => {});

    const ev: any = { preventDefault: jest.fn() };
    await component.onDrop(ev as any, 'in_progress');
    expect(saveTask).toHaveBeenCalled();
    expect(cognitiveAlerts.startTaskTracking).toHaveBeenCalled();
  });

  test('deleteTask success path', async () => {
    const t: Task = { id: 't1', title: 'x', description: '', status: 'todo', priority: 'low', estimatedTime: 0, subtasks: [], tags: [] };
    component.tasks = [t];
    const deleteTask = jest.fn().mockResolvedValue(true);
    const getCurrentUser = jest.fn().mockReturnValue({ uid: 'u1' });
    (global as any).window.firebaseService = { deleteTask, getCurrentUser };
    jest.spyOn(component, 'loadTasks').mockImplementation(async () => {});
    (component as any).showSuccessMessage = jest.fn();

    await component.deleteTask(t, { stopPropagation: () => {} } as any);
    expect(deleteTask).toHaveBeenCalled();
    expect((component as any).showSuccessMessage).toHaveBeenCalled();
    expect(component.deletingTaskId).toBeNull();
  });

  test('onDragStart and onDragOver set dataTransfer properties', () => {
    const t: Task = { id: 't2', title: 'y', description: '', status: 'todo', priority: 'low', estimatedTime: 0, subtasks: [], tags: [] };
    const dt: any = { effectAllowed: '', dropEffect: '' };
    const evStart: any = { dataTransfer: dt };
    component.onDragStart(evStart as any, t);
    expect(component['draggedTask']).toBe(t);

    const evOver: any = { preventDefault: jest.fn(), dataTransfer: { dropEffect: '' } };
    component.onDragOver(evOver as any);
    expect(evOver.preventDefault).toHaveBeenCalled();
  });
});
