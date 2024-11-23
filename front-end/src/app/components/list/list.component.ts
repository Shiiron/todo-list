import { Component, inject } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule} from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { NgIf } from '@angular/common';
import { TodoStateService } from 'src/app/services/todo-state.service';
import { ListItemComponent } from '../list-item/list-item.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  standalone: true,
  imports: [
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,
    ListItemComponent,
    MatDividerModule,
    MatIconModule,
    MatProgressSpinnerModule,
    NgIf

  ],
  styleUrls: ['./list.component.scss']
})
export class ListComponent {
  private todoListStateService = inject(TodoStateService);
  lists = this.todoListStateService.todoLists;
  isLoading = this.todoListStateService.isLoading;

  constructor() {}

  submit() {}
}
