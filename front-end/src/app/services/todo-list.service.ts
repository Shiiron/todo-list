import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { List } from '../model/list';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';

@Injectable()
export class TodoListService {
  listState = signal<{lists: List[], selectedList: number}>({
    lists: [],
    selectedList: null
  });

  // Service injection
  private http = inject(HttpClient);

  // List API
  getList() {
    return this.http.get<List[]>(`${environment.baseUrl}/lists`);
  }

  addList(name: string) {
    return this.http.post<List>(`${environment.baseUrl}/list`,{name: name});
  }

  updateList(id: number, name: string): Observable<List> {
    return this.http.put<List>(`${environment.baseUrl}/list/${id}`, {name: name});
  }

  deleteList(id: number): Observable<List> {
    return this.http.delete<List>(`${environment.baseUrl}/list/${id}`);
  }

  setCurrentList(list: number) {
    this.listState.update(state => ({
      ...state,
      selectedList: list
    }));
  }

  setLists(lists: List[]) {
    this.listState.update(state => ({
      ...state,
      lists: lists
    }))
  }
}
