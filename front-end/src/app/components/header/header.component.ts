import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TodoStateService } from 'src/app/services/todo-state.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})

export class HeaderComponent {
  todoListStateService = inject(TodoStateService);
  addListForm: FormGroup = this.formBuilder.group({ name: null });
  toggleAddList = signal(false);

  constructor(private formBuilder: FormBuilder) {}

  createList() {
      const newList = {ID: null, name: this.addListForm.value['name']};
      this.todoListStateService.addNewList(newList);
  }
}
