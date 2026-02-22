import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    service = new NotificationService();
  });

  test('showNotification adds notification', (done) => {
    service.getNotifications().subscribe(notifications => {
      if (notifications.length > 0) {
        expect(notifications[0].message).toBe('Test');
        done();
      }
    });
    service.showNotification('info', 'Test');
  });

  test('removeNotification removes by id', (done) => {
    service.showNotification('info', 'Test');
    const id = service['notifications'].value[0].id;
    service.removeNotification(id);
    service.getNotifications().subscribe(notifications => {
      expect(notifications.length).toBe(0);
      done();
    });
  });
});
