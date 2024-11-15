import { Component, inject } from '@angular/core';
import { TodoListService } from './services/todo-list.service';
import { ListComponent } from './components/list/list.component';
import { AsyncPipe } from '@angular/common';
import { TaskComponent } from "./components/task/task.component";
import { MatButtonModule } from '@angular/material/button';
import { HeaderComponent } from "./components/header/header.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [ListComponent, TaskComponent, HeaderComponent],
  providers: [TodoListService],
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'todo-list-app';


  constructor() {
  }


}
