import { Component, ElementRef, inject, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { TaskComponent } from '../task/task.component';
import { List } from 'src/app/model/list';
import { TodoStateService } from 'src/app/services/todo-state.service';
import { MatIconModule } from '@angular/material/icon';
import { TodoTask } from 'src/app/model/task';

@Component({
  selector: 'app-list-item',
  standalone: true,
  imports: [MatInputModule, ReactiveFormsModule, MatButtonModule, TaskComponent, MatIconModule],
  templateUrl: './list-item.component.html',
  styleUrl: './list-item.component.scss'
})
export class ListItemComponent {
  @Input() list: List;
  @ViewChild('taskForm') taskForm: NgForm;
  private todoListStateService = inject(TodoStateService);

  addTask = false;
  addList: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.addList = this.formBuilder.group({
      name: ['', Validators.required]
    });
  }

  toggleAddTask() {
    this.addTask = !this.addTask;
  }

  deleteList(list: List) {
    this.todoListStateService.deleteList(list);
  }

  sendForm() {
    if (this.addList.valid) {
      this.toggleAddTask();
      let task: TodoTask = {ID: null, description: this.addList.controls['name'].value, list_id: this.list.ID};
      this.todoListStateService.updateTask(task);
      this.addList.controls['name'].setValue('');
    } else {
      // Trigger validation messages
    }
  }
}
