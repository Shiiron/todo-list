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

  // Task API
  addTask(list_id: number, description: string): Observable<Task> {
    return this.http.post<Task>(`${environment.baseUrl}/task/${list_id}`,{description: description});
  }

  getTask(list_id: number) {
    return this.http.get<TodoTask[]>(`${environment.baseUrl}/tasks/${list_id}`);
  }

  updateTask(id: number, description: string) {
    return this.http.put<Task>(`${environment.baseUrl}/task/${id}`, {description: description})
  }

  deleteTask(id: number) {
    return this.http.delete<Task>(`${environment.baseUrl}/task/${id}`);
  }
}
