import { Component, DestroyRef, inject, signal } from '@angular/core';
import { TodoListService } from 'src/app/services/todo-list.service';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule} from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { List } from 'src/app/model/list';
import { TodoTaskService } from 'src/app/services/todo-task.service';
import { catchError, delay, EMPTY, forkJoin, map, mergeMap, Observable, tap } from 'rxjs';
import { TodoTask } from 'src/app/model/task';
import { AsyncPipe } from '@angular/common';
import { TaskComponent } from '../task/task.component';

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
    AsyncPipe,
    TaskComponent,
    MatDividerModule
  ],
  styleUrls: ['./list.component.scss']
})
export class ListComponent {
  listService = inject(TodoListService);
  taskService = inject(TodoTaskService);
  addList: FormGroup;
  addTask = signal(false);
  lists$: Observable<List[]>;
  selectedList: number;
  error: string;

  constructor(
    private formBuilder: FormBuilder,
    private destroyRef: DestroyRef
  ) {
      this.lists$ = this.listService.getList()
        .pipe(
          mergeMap(lists =>
            forkJoin(lists.map(list =>
              this.taskService.getTask(list.ID)
              .pipe(
                map(tasks => ({
                  ID: list.ID,
                  name: list.name,
                  tasks: tasks.map(t => ({ID: t.ID, description: t.description}) as TodoTask)
                }) as List)
              )
            )
          )),
          takeUntilDestroyed()
        )
  }

  toggleAddTask() {
    this.addTask.set(!this.addTask());
  }

  submit() {}
}
