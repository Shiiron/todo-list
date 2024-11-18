import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TodoListService } from 'src/app/services/todo-list.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})

export class HeaderComponent {
  todoListService = inject(TodoListService);
  addListForm: FormGroup = this.formBuilder.group({ name: null });

  constructor(private formBuilder: FormBuilder) {}

  createList() {
      const newList = {ID: null, name: this.addListForm.value['name']};
      this.todoListService.addNewList(newList);
  }
}
