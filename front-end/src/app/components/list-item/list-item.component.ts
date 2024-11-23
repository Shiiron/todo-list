import { Component, inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { TaskComponent } from '../task/task.component';
import { List } from 'src/app/model/list';
import { TodoStateService } from 'src/app/services/todo-state.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-list-item',
  standalone: true,
  imports: [MatInputModule, ReactiveFormsModule, MatButtonModule, TaskComponent, MatIconModule],
  templateUrl: './list-item.component.html',
  styleUrl: './list-item.component.scss'
})
export class ListItemComponent {
  @Input() list: List;
  private todoListStateService = inject(TodoStateService);

  addTask = false;
  addList: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.addList = this.formBuilder.group({ name: ''});
  }

  toggleAddTask() {
    this.addTask = !this.addTask;
  }

  deleteList(list: List) {
    this.todoListStateService.deleteList(list);
  }

  submit() {}
}
