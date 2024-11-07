import { Component, DestroyRef, inject, Input, signal } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { TodoTaskService } from 'src/app/services/todo-task.service';
import { TodoListService } from 'src/app/services/todo-list.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TodoTask } from 'src/app/model/task';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  standalone: true,
  imports: [
    MatDividerModule,
    MatListModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule
  ],
  styleUrls: ['./task.component.scss']
})
export class TaskComponent {
  taskService = inject(TodoTaskService);
  listService = inject(TodoListService);
  listState = this.listService.listState;
  taskState = this.taskService.taskState;
  displayAddTask = signal(false);
  addTask: FormGroup;

  constructor(private formBuilder: FormBuilder, private destroyRef: DestroyRef) {}

  toggleUpdate() {}

  toggleAdd() {
    this.displayAddTask.set(!this.displayAddTask());

    if (this.displayAddTask()) {
      this.addTask = this.formBuilder.group({
        description: ['']
      })
    } else {
      this.addTask = null;
    }
  }

  deleteTask(id: number) {
    this.taskService.deleteTask(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.taskState().tasks = this.taskState().tasks.filter(task => task.ID !== +id)
      },
      error: err => console.log(err)
    })
  }

  submit() {
    const newTask: TodoTask = {
      ID: null,
      description: this.addTask.value['description'],
      list_id: this.listState().selectedList
    }

    this.taskService.addTask(newTask.list_id, newTask.description)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (task: any) => {
          newTask.ID = task.id;
          this.taskState().tasks.push(newTask);
          this.toggleAdd();
        },
        error: err => console.log(err)
      })
  }
}
