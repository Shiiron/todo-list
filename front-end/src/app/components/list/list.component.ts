import { Component, DestroyRef, inject, Signal, signal } from '@angular/core';
import { TodoListService } from 'src/app/services/todo-list.service';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule} from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { List } from 'src/app/model/list';
import { TodoTaskService } from 'src/app/services/todo-task.service';
import { TaskComponent } from '../task/task.component';
import { MatIconModule } from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  standalone: true,
  imports: [
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,
    TaskComponent,
    MatDividerModule,
    MatIconModule,
    MatProgressSpinnerModule,
    NgIf
  ],
  styleUrls: ['./list.component.scss']
})
export class ListComponent {
  todoListService = inject(TodoListService);
  taskService = inject(TodoTaskService);
  addList: FormGroup;
  addTask = signal(false);
  lists = this.todoListService.todoLists;
  isLoading = this.todoListService.isLoading;
  selectedList: number;
  error: string;

  constructor(
    private formBuilder: FormBuilder,
    private destroyRef: DestroyRef
  ) {}

  toggleAddTask() {
    this.addTask.set(!this.addTask());
  }

  submit() {
    this.addTask.set(false);
  }

  deleteList(list: List) {
    this.todoListService.deleteList(list);
  }
}
