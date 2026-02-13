import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { MatIconModule } from '@angular/material/icon';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent, MatIconModule]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty tasks', () => {
    expect(component.upcomingTasks).toEqual([]);
    expect(component.totalTasks).toBe(0);
  });

  it('should calculate stats correctly', () => {
    component['allTasks'] = [
      { status: 'todo', priority: 'Alta' } as any,
      { status: 'in_progress', priority: 'Alta' } as any,
      { status: 'done', priority: 'Baixa' } as any
    ];
    component['calculateStats']();
    
    expect(component.totalTasks).toBe(3);
    expect(component.todoTasks).toBe(1);
    expect(component.inProgressTasks).toBe(1);
    expect(component.doneTasks).toBe(1);
    expect(component.highPriorityTasks).toBe(2);
    expect(component.completionPercentage).toBe(33);
  });

  it('should return correct priority color', () => {
    expect(component.getPriorityColor('Alta')).toBe('#EF4444');
    expect(component.getPriorityColor('Média')).toBe('#F59E0B');
    expect(component.getPriorityColor('Baixa')).toBe('#3B82F6');
  });

  it('should reset stats', () => {
    component.totalTasks = 10;
    component['resetStats']();
    expect(component.totalTasks).toBe(0);
    expect(component.upcomingTasks).toEqual([]);
  });
});