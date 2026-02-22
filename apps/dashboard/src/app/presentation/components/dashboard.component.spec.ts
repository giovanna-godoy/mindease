jest.mock('@angular/common', () => ({ CommonModule: {} }));
jest.mock('@angular/material/icon', () => ({ MatIconModule: {} }));
jest.mock('./stats-card.component', () => ({ StatsCardComponent: {} }));
jest.mock('./pomodoro-timer.component', () => ({ PomodoroTimerComponent: {} }));
jest.mock('@angular/router', () => ({ Router: function Router() {}, NavigationEnd: function NavigationEnd() {} }));

import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let comp: DashboardComponent;
  const mockCdr: any = { detectChanges: jest.fn() };

  beforeEach(() => {
    comp = new DashboardComponent({} as any, mockCdr as any);
    (global as any).window = (global as any).window || {};
  });

  test('calculateStats computes counts and percentage', () => {
    comp.allTasks = [
      { id: '1', title: 'a', description: '', status: 'todo', priority: 'high', estimatedTime: 0, subtasks: [], tags: [] },
      { id: '2', title: 'b', description: '', status: 'done', priority: 'low', estimatedTime: 0, subtasks: [], tags: [] }
    ];
    (comp as any).calculateStats();
    expect(comp.totalTasks).toBe(2);
    expect(comp.doneTasks).toBe(1);
    expect(comp.completionPercentage).toBe(50);
  });

  test('getPriorityColor returns correct hex', () => {
    expect(comp.getPriorityColor('high')).toBe('#EF4444');
    expect(comp.getPriorityColor('medium')).toBe('#F59E0B');
  });

  test('testNotification dispatches event', () => {
    window.dispatchEvent = jest.fn();
    comp.testNotification('info');
    expect(window.dispatchEvent).toHaveBeenCalled();
  });
});
