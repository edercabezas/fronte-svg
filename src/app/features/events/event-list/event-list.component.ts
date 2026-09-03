import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgClass, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EventsService } from '../../../core/services/events.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { Event, EventFilters, EventStatus } from '../../../core/models/event.models';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [RouterLink, FormsModule, NgClass, DatePipe, MatCardModule, MatButtonModule, MatIconModule, MatInputModule, MatSelectModule, MatFormFieldModule, MatChipsModule, MatProgressBarModule, MatMenuModule, MatTooltipModule],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.scss'
})
export class EventListComponent implements OnInit {
  private svc = inject(EventsService);
  auth = inject(AuthService);
  private toast = inject(ToastService);

  loading = signal(true);
  events = signal<Event[]>([]);
  searchTerm = '';
  statusFilter: EventStatus | '' = '';

  ngOnInit(): void { this.loadEvents(); }

  loadEvents(): void {
    this.loading.set(true);
    const filters: EventFilters = { search: this.searchTerm, status: this.statusFilter };
    this.svc.getAll(filters).subscribe({ next: res => { this.events.set(res.data); this.loading.set(false); } });
  }

  onFilter(): void { this.loadEvents(); }

  statusLabel(s: EventStatus): string {
    const map: Record<EventStatus, string> = { draft: 'Borrador', active: 'Activo', completed: 'Completado', cancelled: 'Cancelado' };
    return map[s];
  }

  changeStatus(event: Event, status: EventStatus): void {
    this.svc.updateStatus(event.id, status).subscribe(() => { this.toast.success('Estado actualizado'); this.loadEvents(); });
  }

  deleteEvent(event: Event): void {
    if (!confirm(`¿Eliminar "${event.name}"?`)) return;
    this.svc.delete(event.id).subscribe(() => { this.toast.success('Evento eliminado'); this.loadEvents(); });
  }
}
