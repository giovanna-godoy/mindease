import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  standalone: true,
})
export class FilterPipe implements PipeTransform {
  transform(tasks: any[], status: string): any[] {
    if (!tasks) return [];
    return tasks.filter(task => task.status === status);
  }
}
