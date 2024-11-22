import { Component, inject, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TodoTask } from 'src/app/model/task';
import { TodoStateService } from 'src/app/services/todo-state.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  styleUrls: ['./task.component.scss']
})
export class TaskComponent {
  @Input() task: TodoTask;
  todoStateService = inject(TodoStateService);

  constructor() {}

  removeTask() {
    this.todoStateService.deleteTask(this.task);
  }
}
