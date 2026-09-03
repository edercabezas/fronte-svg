import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass, DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UsersService } from '../../../core/services/users.service';
import { ToastService } from '../../../core/services/toast.service';
import { User, UserRole, ROLE_LABELS } from '../../../core/models/user.models';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [RouterLink, NgClass, DatePipe, MatTableModule, MatButtonModule, MatIconModule, MatChipsModule, MatCardModule, MatProgressBarModule, MatTooltipModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {
  private svc = inject(UsersService);
  private toast = inject(ToastService);

  loading = signal(true);
  users = signal<User[]>([]);
  columns = ['name', 'role', 'status', 'created', 'actions'];

  ngOnInit(): void {
    this.svc.getAll().subscribe({ next: data => { this.users.set(data); this.loading.set(false); } });
  }

  roleLabel(role: UserRole): string {
    return ROLE_LABELS[role];
  }

  toggleActive(user: User): void {
    this.svc.toggleActive(user.id).subscribe(updated => {
      this.users.update(list => list.map(u => u.id === user.id ? updated : u));
      this.toast.success(`Usuario ${updated.isActive ? 'activado' : 'desactivado'}`);
    });
  }
}
