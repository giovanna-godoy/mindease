jest.mock('@angular/common', () => ({ CommonModule: {} }));
jest.mock('@angular/material/icon', () => ({ MatIconModule: {} }));

import { NotificationComponent } from './notification.component';

describe('NotificationComponent', () => {
  let comp: NotificationComponent;
  const mockService: any = { getNotifications: () => ({ subscribe: (cb: any) => { cb([]); return { unsubscribe: () => {} }; } }), removeNotification: jest.fn(), showNotification: jest.fn() };

  beforeEach(() => {
    comp = new NotificationComponent(mockService as any);
    (global as any).window = (global as any).window || {};
  });

  test('getIcon returns icons for types', () => {
    expect(comp.getIcon('info')).toBe('info');
    expect(comp.getIcon('success')).toBe('check_circle');
    expect(comp.getIcon('unknown')).toBe('notifications');
  });

  test('getIconColor returns correct colors', () => {
    expect(comp.getIconColor('info')).toBe('#3B82F6');
    expect(comp.getIconColor('success')).toBe('#10B981');
    expect(comp.getIconColor('unknown')).toBe('#6B7280');
  });

  test('removeNotification delegates to service', () => {
    comp.removeNotification('id1');
    expect(mockService.removeNotification).toHaveBeenCalledWith('id1');
  });
});
