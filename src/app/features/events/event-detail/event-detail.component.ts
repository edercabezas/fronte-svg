import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgClass, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { EventsService } from '../../../core/services/events.service';
import { AuthService } from '../../../core/services/auth.service';
import { Event } from '../../../core/models/event.models';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [RouterLink, NgClass, DatePipe, MatCardModule, MatButtonModule, MatIconModule, MatTabsModule, MatChipsModule, MatProgressBarModule],
  templateUrl: './event-detail.component.html',
  styleUrl: './event-detail.component.scss'
})
export class EventDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private svc = inject(EventsService);
  auth = inject(AuthService);

  loading = signal(true);
  event = signal<Event | null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.svc.getById(id).subscribe({ next: ev => { this.event.set(ev); this.loading.set(false); } });
  }

  statusLabel(s: string): string {
    const map: Record<string, string> = { draft: 'Borrador', active: 'Activo', completed: 'Completado', cancelled: 'Cancelado' };
    return map[s] ?? s;
  }
}
