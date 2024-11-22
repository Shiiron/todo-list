import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { map, of, Subject, switchMap, tap } from 'rxjs';
import { List } from '../model/list';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TodoTaskService } from './todo-task.service';
import { TodoListService } from './todo-list.service';
import { TodoTask } from '../model/task';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class TodoStateService {
  private destroyRef = inject(DestroyRef);
  // initial State for service
  private listState = signal<{lists: List[]; isLoading: boolean}>({
    lists: [],
    isLoading: false
  });

  // Subjects
  private deleteListSubject = new Subject<List>();
  private updateListSubject = new Subject<List>();
  private deleteTaskSubject = new Subject<TodoTask>();
  private updateTaskSubject = new Subject<TodoTask>();

  // Selectors
  todoLists = computed(() => this.listState().lists);
  isLoading = computed(() => this.listState().isLoading);

  // Dependancy
  private taskService = inject(TodoTaskService);
  private todoListService = inject(TodoListService);
  private snackService = inject(MatSnackBar);

  constructor() {
    this.todoListService.getList()
      .pipe(
      tap(() => this.setLoading(true))
    ).subscribe(lists => {
      this.setLists(lists);
    });

    this.updateListSubject
    .pipe(
      tap(() => this.setLoading(true)),
      switchMap((list: List) => this.todoListService.updateList(list)),
      switchMap((id: {id: number}) => this.todoListService.getList(id.id)),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(list => {
      this.addToList(list);
      this.displayMessage("La liste a été mise à jour");
    });

    this.deleteListSubject
    .pipe(
      tap(() => this.setLoading(true)),
      switchMap((list) =>
        this.todoListService.deleteTodoList(list)
          .pipe(map(() => this.removeList(list.ID)))
      ),
      takeUntilDestroyed(),
    ).subscribe(() => {
      this.displayMessage("La liste à été effacée");
    });
  }

  addNewList(list: List) {
    this.updateListSubject.next(list);
  }

  deleteList(list: List) {
    this.deleteListSubject.next(list);
  }

  updateTask(task: TodoTask) {
    this.updateTaskSubject.next(task)
  }

  deleteTask(task: TodoTask) {
    this.deleteTaskSubject.next(task);
  }

  private setLoading(loading: boolean) {
    this.listState.update(state => ({
      ...state,
      isLoading: loading
    }));
  }

  // List management
  private setLists(lists: List[]) {
    this.listState.update(state => ({
      ...state,
      lists: lists,
      isLoading: false
    }));
  }

  private addToList(list: List[]) {
    this.listState.update(state => ({
      ...state,
      lists: [...this.listState().lists, list[0]],
      isLoading: false
    }));
  }

  private removeList(id: number) {
    this.listState.update(state => ({
      ...state,
      lists: this.listState().lists.filter(list => list.ID !== id),
      isLoading: false
    }))
  }

  // Task management
  private addTaskToList() {}

  private removeTaskFromList() {}

  displayMessage(message: string) {
    this.snackService.open(message, null, {duration: 3000});
    return of([]);
  }
}
