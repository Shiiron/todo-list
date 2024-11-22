import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { List } from '../model/list';
import { catchError, delay, forkJoin, map, mergeMap, Observable, of } from 'rxjs';
import { environment } from 'src/environment/environment';
import { TodoTaskService } from './todo-task.service';
import { TodoTask } from '../model/task';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class TodoListService {
  // Service injection
  private http = inject(HttpClient);
  private taskService = inject(TodoTaskService);
  private destroyRef = inject(DestroyRef)
  private snackService = inject(MatSnackBar);

  constructor() {}

  // List API
  getList(id?: number) {
    let url = `${environment.baseUrl}/lists`;
    if (id) {
      url = `${environment.baseUrl}/list/${id}`
    }
    return this.http.get<List[]>(url)
    .pipe(
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
      catchError(err => this.displayMessage(err.message)),
      takeUntilDestroyed(this.destroyRef)
    );
  }

  updateList(list: List): Observable<{id: number}> {
    let obs$;
    if (list.ID) {
      obs$ = this.http.put<List>(`${environment.baseUrl}/list/${list.ID}`, {name: list.name});
    } else {
      obs$ = this.http.post<List>(`${environment.baseUrl}/list`,{name: list.name});
    }

    return obs$;
  }

  deleteTodoList(list: List): Observable<List> {
    return this.http.delete<List>(`${environment.baseUrl}/list/${list.ID}`);
  }

  displayMessage(message: string) {
    this.snackService.open(message, null, {duration: 3000});
    return of([]);
  }
}
