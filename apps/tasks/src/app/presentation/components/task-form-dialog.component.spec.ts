// Mock Angular modules used by the component to avoid linker/JIT requirements
jest.mock('@angular/common', () => ({ CommonModule: {} }));
jest.mock('@angular/forms', () => ({ FormsModule: {} }));
jest.mock('@angular/material/icon', () => ({ MatIconModule: {} }));
jest.mock('@angular/material/datepicker', () => ({ MatDatepickerModule: {} }));
jest.mock('@angular/material/input', () => ({ MatInputModule: {} }));
jest.mock('@angular/material/core', () => ({ MatNativeDateModule: {} }));

import { TaskFormDialogComponent } from './task-form-dialog.component';

describe('TaskFormDialogComponent (unit)', () => {
  let component: TaskFormDialogComponent;

  beforeEach(() => {
    component = new TaskFormDialogComponent();
  });

  test('resetForm uses provided task when present', () => {
    const sampleTask: any = {
      id: '1', title: 'T', description: 'D', status: 'in_progress', priority: 'high', estimatedTime: 30,
      tags: ['a'], subtasks: [{ id: 's1', title: 's', completed: false }], dueDate: '2026-02-22'
    };
    component.task = sampleTask as any;
    component.defaultStatus = 'todo';
    component.ngOnChanges({ task: { currentValue: sampleTask, previousValue: null, firstChange: true, isFirstChange: () => true } } as any);

    expect(component.formData.title).toBe('T');
    expect(component.formData.status).toBe('in_progress');
    expect(component.formData.tags).toEqual(['a']);
  });

  test('onSubmit does not emit when title empty', () => {
    component.formData.title = '   ';
    const spy = jest.spyOn(component.taskSubmit, 'emit');
    component.onSubmit();
    expect(spy).not.toHaveBeenCalled();
  });

  test('onSubmit emits task and closes dialog when valid', () => {
    component.formData.title = ' My Task ';
    component.formData.description = ' desc ';
    component.formData.estimatedMinutes = 15;
    const spySubmit = jest.spyOn(component.taskSubmit, 'emit');
    const spyClose = jest.spyOn(component.openChange, 'emit');

    component.onSubmit();

    expect(spySubmit).toHaveBeenCalledWith(expect.objectContaining({ title: 'My Task', description: 'desc', estimatedTime: 15 }));
    expect(spyClose).toHaveBeenCalledWith(false);
  });

  test('addTag adds non-empty, non-duplicate tag and clears newTag', () => {
    component.newTag = 'tag1';
    component.formData.tags = [];
    component.addTag();
    expect(component.formData.tags).toContain('tag1');
    expect(component.newTag).toBe('');

    // duplicate should not be added
    component.newTag = 'tag1';
    component.addTag();
    expect(component.formData.tags.filter(t => t === 'tag1').length).toBe(1);
  });

  test('removeTag removes the specified tag', () => {
    component.formData.tags = ['a', 'b'];
    component.removeTag('a');
    expect(component.formData.tags).toEqual(['b']);
  });

  test('addSubtask only adds when task exists and newSubtask provided', () => {
    component.task = null;
    component.newSubtask = 'sub1';
    component.formData.subtasks = [];
    component.addSubtask();
    expect(component.formData.subtasks.length).toBe(0);

    component.task = {} as any;
    component.newSubtask = 'sub1';
    component.addSubtask();
    expect(component.formData.subtasks.length).toBe(1);
    expect(component.newSubtask).toBe('');
  });

  test('onOverlayClick closes when clicking overlay', () => {
    const spyClose = jest.spyOn(component.openChange, 'emit');
    const ev: any = { target: {}, currentTarget: {} };
    // same object means overlay clicked
    ev.target = ev.currentTarget;
    component.onOverlayClick(ev);
    expect(spyClose).toHaveBeenCalledWith(false);
  });
});
