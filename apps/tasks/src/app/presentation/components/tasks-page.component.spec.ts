import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TasksPageComponent, Task } from './tasks-page.component';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('TasksPageComponent', () => {
  let component: TasksPageComponent;
  let fixture: ComponentFixture<TasksPageComponent>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate'], {
      events: of()
    });

    await TestBed.configureTestingModule({
      imports: [TasksPageComponent, MatIconModule],
      providers: [
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TasksPageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty tasks', () => {
    expect(component.tasks).toEqual([]);
  });

  it('should return correct priority color', () => {
    expect(component.getPriorityColor('high')).toBe('#EF4444');
    expect(component.getPriorityColor('medium')).toBe('#F59E0B');
    expect(component.getPriorityColor('low')).toBe('#3B82F6');
  });

  it('should count completed subtasks', () => {
    const task: Task = {
      id: '1',
      title: 'Test',
      description: 'Test',
      status: 'todo',
      priority: 'low',
      estimatedTime: 30,
      subtasks: [
        { id: '1', title: 'Sub 1', completed: true },
        { id: '2', title: 'Sub 2', completed: false }
      ],
      tags: []
    };
    expect(component.getCompletedSubtasks(task)).toBe(1);
  });

  it('should count total subtasks', () => {
    const task: Task = {
      id: '1',
      title: 'Test',
      description: 'Test',
      status: 'todo',
      priority: 'low',
      estimatedTime: 30,
      subtasks: [
        { id: '1', title: 'Sub 1', completed: true },
        { id: '2', title: 'Sub 2', completed: false }
      ],
      tags: []
    };
    expect(component.getTotalSubtasks(task)).toBe(2);
  });

  it('should open new task dialog', () => {
    component.openNewTaskDialog('in_progress');
    expect(component.isDialogOpen).toBe(true);
    expect(component.dialogDefaultStatus).toBe('in_progress');
    expect(component.dialogTask).toBeNull();
  });

  it('should open edit task dialog', () => {
    const task: Task = {
      id: '1',
      title: 'Test',
      description: 'Test',
      status: 'todo',
      priority: 'low',
      estimatedTime: 30,
      subtasks: [],
      tags: []
    };
    component.openEditTaskDialog(task);
    expect(component.isDialogOpen).toBe(true);
    expect(component.dialogTask).toBe(task);
  });

  it('should handle drag start', () => {
    const task: Task = {
      id: '1',
      title: 'Test',
      description: 'Test',
      status: 'todo',
      priority: 'low',
      estimatedTime: 30,
      subtasks: [],
      tags: []
    };
    const event = new DragEvent('dragstart');
    component.onDragStart(event, task);
    expect(component['draggedTask']).toBe(task);
  });
});