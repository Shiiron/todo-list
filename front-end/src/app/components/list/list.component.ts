import { Component, inject, signal } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule} from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { List } from 'src/app/model/list';
import { TaskComponent } from '../task/task.component';
import { MatIconModule } from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { NgIf } from '@angular/common';
import { TodoStateService } from 'src/app/services/todo-state.service';

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
  todoListStateService = inject(TodoStateService);
  addList: FormGroup;
  addTask = signal(false);
  lists = this.todoListStateService.todoLists;
  isLoading = this.todoListStateService.isLoading;

  constructor() {}

  toggleAddTask() {
    this.addTask.set(!this.addTask());
  }

  submit() {
    this.addTask.set(false);
  }

  deleteList(list: List) {
    this.todoListStateService.deleteList(list);
  }
}
