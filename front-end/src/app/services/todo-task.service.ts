import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { TodoTask } from '../model/task';

@Injectable({
  providedIn: 'root'
})
export class TodoTaskService {
  private http = inject(HttpClient);

  constructor() {}

  getTask(list_id: number) {
    return this.http.get<TodoTask[]>(`${environment.baseUrl}/tasks/${list_id}`);
  }

  updateTask(task: TodoTask): Observable<TodoTask> {
    let obs$;
    if (task.ID) {
      obs$ = this.http.put<TodoTask>(`${environment.baseUrl}/task/${task.ID}`, {description: task.description})
    } else {
      obs$ = this.http.post<TodoTask>(`${environment.baseUrl}/task/${task.list_id}`,{description: task.description});
    }

    return obs$;
  }

  deleteTask(id: number) {
    return this.http.delete<TodoTask>(`${environment.baseUrl}/task/${id}`);
  }
}
