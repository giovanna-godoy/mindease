// Mock Angular modules and local imports
jest.mock('@angular/common', () => ({ CommonModule: {} }));
jest.mock('@angular/forms', () => ({ FormsModule: {} }));
jest.mock('@angular/material/icon', () => ({ MatIconModule: {} }));
jest.mock('../pipes/filter.pipe', () => ({ FilterPipe: {} }));
jest.mock('./task-form-dialog.component', () => ({ TaskFormDialogComponent: {} }));
jest.mock('./empty-state.component', () => ({ EmptyStateComponent: {} }));
jest.mock('@angular/router', () => ({ Router: function Router() {}, NavigationEnd: function NavigationEnd() {} }));

import { TasksPageComponent } from './tasks-page.component';
import { Task } from '../../types/task.types';

describe('TasksPageComponent (unit)', () => {
  let component: TasksPageComponent;
  const mockRouter: any = { events: { subscribe: () => ({ unsubscribe: () => {} }) } };
  const mockCdr: any = { markForCheck: jest.fn() };
  const mockTasksService: any = {
    loadTasks: jest.fn().mockResolvedValue([]),
    saveTask: jest.fn().mockResolvedValue(true),
    deleteTask: jest.fn().mockResolvedValue(true),
    updateTaskStatus: jest.fn().mockResolvedValue(true),
    addSubtask: jest.fn().mockResolvedValue(true),
    getNextStatus: jest.fn().mockReturnValue('in_progress'),
    getStatusName: jest.fn().mockReturnValue('Em Progresso'),
    getPriorityColor: jest.fn((priority: string) => {
      switch (priority) {
        case 'high': return '#EF4444';
        case 'medium': return '#F59E0B';
        case 'low': return '#3B82F6';
        default: return '#6B7280';
      }
    }),
    getCompletedSubtasksCount: jest.fn((subtasks: any[]) => subtasks.filter(s => s.completed).length),
    notifyTasksUpdated: jest.fn()
  };
  const mockNotificationService: any = {
    showSuccess: jest.fn(),
    showError: jest.fn(),
    showInfo: jest.fn()
  };

  beforeEach(() => {
    component = new TasksPageComponent(mockRouter as any, mockCdr as any, mockTasksService as any, mockNotificationService as any);
    jest.clearAllMocks();
  });

  test('getPriorityColor returns correct colors', () => {
    expect(component.getPriorityColor('high')).toBe('#EF4444');
    expect(component.getPriorityColor('medium')).toBe('#F59E0B');
    expect(component.getPriorityColor('low')).toBe('#3B82F6');
    expect(component.getPriorityColor('other')).toBe('#6B7280');
  });

  test('subtasks helpers', () => {
    const task: Task = { id: 't1', title: 't', description: '', status: 'todo', priority: 'low', estimatedTime: 0, subtasks: [{ id: 's1', title: 's', completed: true }], tags: [], createdAt: new Date(), updatedAt: new Date() };
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
      { id: '1', title: 'a', description: '', status: 'todo', priority: 'low', estimatedTime: 0, subtasks: [], tags: [], createdAt: new Date(), updatedAt: new Date() },
      { id: '2', title: 'b', description: '', status: 'in_progress', priority: 'low', estimatedTime: 0, subtasks: [], tags: [], createdAt: new Date(), updatedAt: new Date() },
    ];
    expect(component.getTaskCountByStatus('todo')).toBe(1);
    expect(component.getTaskCountByStatus('in_progress')).toBe(1);
    expect(component.getTaskCountByStatus('done')).toBe(0);
  });

  test('addSubtask does nothing when newSubtaskTitle empty', async () => {
    const task: Task = { id: '1', title: 'a', description: '', status: 'todo', priority: 'low', estimatedTime: 0, subtasks: [], tags: [], createdAt: new Date(), updatedAt: new Date() };
    component.newSubtaskTitle = '   ';
    await component.addSubtask(task);
    expect(mockTasksService.addSubtask).not.toHaveBeenCalled();
  });

  test('addSubtask adds subtask successfully', async () => {
    const task: Task = { id: '1', title: 'a', description: '', status: 'todo', priority: 'low', estimatedTime: 0, subtasks: [], tags: [], createdAt: new Date(), updatedAt: new Date() };
    component.newSubtaskTitle = 'New Sub';
    jest.spyOn(component, 'loadTasks').mockImplementation(async () => {});

    await component.addSubtask(task);

    expect(mockTasksService.addSubtask).toHaveBeenCalled();
    expect(mockNotificationService.showSuccess).toHaveBeenCalled();
    expect(component.newSubtaskTitle).toBe('');
  });

  test('toggleTaskStatus updates status', async () => {
    const t: Task = { id: 't1', title: 'x', description: '', status: 'todo', priority: 'low', estimatedTime: 0, subtasks: [], tags: [], createdAt: new Date(), updatedAt: new Date() };
    jest.spyOn(component, 'loadTasks').mockImplementation(async () => {});

    await component.toggleTaskStatus(t);

    expect(mockTasksService.getNextStatus).toHaveBeenCalled();
    expect(mockTasksService.updateTaskStatus).toHaveBeenCalled();
    expect(mockNotificationService.showSuccess).toHaveBeenCalled();
  });

  test('deleteTask success path', async () => {
    const t: Task = { id: 't1', title: 'x', description: '', status: 'todo', priority: 'low', estimatedTime: 0, subtasks: [], tags: [], createdAt: new Date(), updatedAt: new Date() };
    jest.spyOn(component, 'loadTasks').mockImplementation(async () => {});

    await component.deleteTask(t, { stopPropagation: () => {} } as any);
    
    expect(mockTasksService.deleteTask).toHaveBeenCalled();
    expect(mockNotificationService.showSuccess).toHaveBeenCalled();
    expect(component.deletingTaskId).toBeNull();
  });

  test('loadTasks sets tasks', async () => {
    const tasksMock = [{ id: 'a', title: 'A', description: '', status: 'todo', priority: 'low', estimatedTime: 0, subtasks: [], tags: [], createdAt: new Date(), updatedAt: new Date() }];
    mockTasksService.loadTasks.mockResolvedValue(tasksMock);

    await component.loadTasks();
    
    expect(component.tasks).toEqual(tasksMock);
  });

  test('refreshTasks calls loadTasks and shows success', async () => {
    const loadSpy = jest.spyOn(component, 'loadTasks').mockImplementation(async () => {});
    
    await component.refreshTasks();
    
    expect(loadSpy).toHaveBeenCalled();
    expect(mockNotificationService.showSuccess).toHaveBeenCalled();
  });

  test('onTaskSubmit creates new task', async () => {
    jest.spyOn(component, 'loadTasks').mockImplementation(async () => {});

    await component.onTaskSubmit({ title: 'Task', description: '' } as any);
    
    expect(mockTasksService.saveTask).toHaveBeenCalled();
    expect(mockNotificationService.showSuccess).toHaveBeenCalled();
  });

  test('onDrop moves task', async () => {
    const task: Task = { id: 't1', title: 'x', description: '', status: 'todo', priority: 'low', estimatedTime: 0, subtasks: [], tags: [], createdAt: new Date(), updatedAt: new Date() };
    component.draggedTask = task;
    jest.spyOn(component, 'loadTasks').mockImplementation(async () => {});

    const ev: any = { preventDefault: jest.fn() };
    await component.onDrop(ev as any, 'in_progress');
    
    expect(mockTasksService.updateTaskStatus).toHaveBeenCalled();
    expect(mockNotificationService.showSuccess).toHaveBeenCalled();
  });

  test('onDragStart sets draggedTask', () => {
    const t: Task = { id: 't2', title: 'y', description: '', status: 'todo', priority: 'low', estimatedTime: 0, subtasks: [], tags: [], createdAt: new Date(), updatedAt: new Date() };
    const dt: any = { effectAllowed: '' };
    const evStart: any = { dataTransfer: dt };
    
    component.onDragStart(evStart as any, t);
    
    expect(component['draggedTask']).toBe(t);
  });

  test('onDragOver prevents default', () => {
    const evOver: any = { preventDefault: jest.fn(), dataTransfer: { dropEffect: '' } };
    
    component.onDragOver(evOver as any);
    
    expect(evOver.preventDefault).toHaveBeenCalled();
  });
});
