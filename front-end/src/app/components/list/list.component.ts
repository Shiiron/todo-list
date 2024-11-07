import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { TodoListService } from 'src/app/services/todo-list.service';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule} from '@angular/material/input';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TodoTask } from 'src/app/model/task';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { List } from 'src/app/model/list';
import { TodoTaskService } from 'src/app/services/todo-task.service';
import { delay } from 'rxjs';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  standalone: true,
  imports: [
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule
  ],
  styleUrls: ['./list.component.scss']
})
export class ListComponent {
  listService = inject(TodoListService);
  taskService = inject(TodoTaskService);
  addList: FormGroup;
  displayAddList = signal(false);
  listState = this.listService.listState;
  lists: List[] = [];
  selectedList: number;

  constructor(
    private formBuilder: FormBuilder,
    private destroyRef: DestroyRef
  ) {
    this.listService.getList()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: lists => this.lists = lists,
        error: err => console.log(err)
      });
  }

  onChange(value) {
    this.listService.setCurrentList(value);
    this.taskService.getTask(value)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        delay(1000))
      .subscribe({
        next: tasks => this.taskService.setTasks(tasks),
        error: err => console.log(err)
      })
  }

  toggleAdd() {
    this.displayAddList.set(!this.displayAddList());

    if (this.displayAddList()) {
      this.addList = this.formBuilder.group({
        name: ['']
      })
    } else {
      this.addList = null;
    }
  }

  submit() {
    const newList: List = {
      ID: null,
      name: this.addList.value['name']
    }

    this.listService.addList(newList.name)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (list: any) => {
          newList.ID = list.id;
          this.toggleAdd();
          this.lists.push(newList);
          this.listService.setLists(this.lists);
        },
        error: err => console.log(err)
      })
  }

  deleteList() {
    this.listService.deleteList(this.listState().selectedList)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.lists = this.lists.filter((list) => list.ID !== +this.selectedList);
          this.selectedList = null;
          this.listService.setLists(this.lists);
          this.listService.setCurrentList(null);
        },
        error: err => console.log(err)
      })
  }
}
