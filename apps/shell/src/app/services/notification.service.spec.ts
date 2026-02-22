import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    service = new NotificationService();
  });

  test('showNotification adds notification', (done) => {
    service.showNotification('info', 'Test');
    service.getNotifications().subscribe(notifications => {
      expect(notifications.length).toBe(1);
      expect(notifications[0].message).toBe('Test');
      done();
    });
  });

  test('removeNotification removes by id', (done) => {
    service.showNotification('info', 'Test');
    service.getNotifications().subscribe(notifications => {
      if (notifications.length > 0) {
        const id = notifications[0].id;
        service.removeNotification(id);
        setTimeout(() => {
          service.getNotifications().subscribe(updated => {
            expect(updated.length).toBe(0);
            done();
          });
        }, 10);
      }
    });
  });
});
