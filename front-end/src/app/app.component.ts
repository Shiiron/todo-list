import { Component } from '@angular/core';
import { ListComponent } from './components/list/list.component';
import { HeaderComponent } from "./components/header/header.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [ListComponent, HeaderComponent],
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'todo-list-app';


  constructor() {
  }


}
