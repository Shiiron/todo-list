import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { List } from '../model/list';
import { catchError, delay, forkJoin, map, mergeMap, Observable, of, Subject, switchMap, tap } from 'rxjs';
import { environment } from 'src/environment/environment';
import { TodoTaskService } from './todo-task.service';
import { TodoTask } from '../model/task';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable()
export class TodoListService {
  // Service injection
  private http = inject(HttpClient);
  private taskService = inject(TodoTaskService);
  private snackService = inject(MatSnackBar)

  // Subjects
  private deleteListSubject = new Subject<List>();
  private updateListSubject = new Subject<List>();

  // initial State for service
  private listState = signal<{lists: List[]; isLoading: boolean}>({
    lists: [],
    isLoading: false
  });

  // Selectors
  todoLists = computed(() => this.listState().lists);
  isLoading = computed(() => this.listState().isLoading);

  toggleAddList = signal(false);

  constructor() {
    this.getList().subscribe(lists => this.setLists(lists));

    this.updateListSubject
      .pipe(
        tap(() => this.setLoading(true)),
        switchMap((list: List) => this.updateList(list)),
        switchMap(() => this.getList()),
        takeUntilDestroyed(),
      ).subscribe(list => {
        this.setLists(list);
        this.displayMessage("La liste a été mise à jour");
      });

    this.deleteListSubject
      .pipe(
        tap(() => this.setLoading(true)),
        switchMap((list) => this.deleteTodoList(list)),
        switchMap(() => this.getList()),
        takeUntilDestroyed(),
      ).subscribe(list => {
        this.setLists(list);
        this.displayMessage("La liste à été effacée");
      });
  }

  addNewList(list: List) {
    this.updateListSubject.next(list);
  }

  deleteList(list: List) {
    this.deleteListSubject.next(list);
  }

  private displayMessage(message: string) {
    this.snackService.open(message, null, {duration: 3000});
    return of([]);
  }

  // List API
  private getList() {
    return this.http.get<List[]>(`${environment.baseUrl}/lists`)
    .pipe(
      tap(() => this.setLoading(true)),
      mergeMap(lists =>
        forkJoin(lists.map(list =>
          this.taskService.getTask(list.ID)
          .pipe(
            delay(1000),
            map(tasks => ({
              ID: list.ID,
              name: list.name,
              tasks: tasks.map(t => ({ID: t.ID, description: t.description} as TodoTask))
            } as List))
          )
        )
      )),
      catchError(err => this.displayMessage(err.message))
    );
  }

  private updateList(list: List): Observable<List> {
    let obs$;
    if (list.ID) {
      obs$ = this.http.put<List>(`${environment.baseUrl}/list/${list.ID}`, {name: list.name});
    } else {
      obs$ = this.http.post<List>(`${environment.baseUrl}/list`,{name: list.name});
    }

    return obs$;
  }

  private deleteTodoList(list: List): Observable<List> {
    return this.http.delete<List>(`${environment.baseUrl}/list/${list.ID}`);
  }

  private setLoading(loading: boolean) {
    this.listState.update(state => ({
      ...state,
      isLoading: loading
    }));
  }

  private setLists(lists: List[]) {
    this.listState.update(state => ({
      ...state,
      lists: lists,
      isLoading: false
    }));
  }
}
