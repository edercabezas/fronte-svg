import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatBadgeModule } from '@angular/material/badge';
import { ParticipantsService } from '../../../core/services/participants.service';
import { EventsService } from '../../../core/services/events.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { Participant, CertificationStatus } from '../../../core/models/participant.models';
import { Event, TrainerRef } from '../../../core/models/event.models';

@Component({
  selector: 'app-registrations',
  standalone: true,
  imports: [
    FormsModule, RouterLink, NgClass,
    MatTableModule, MatButtonModule, MatIconModule,
    MatInputModule, MatFormFieldModule, MatSelectModule,
    MatChipsModule, MatProgressBarModule, MatTooltipModule,
    MatCardModule, MatExpansionModule, MatBadgeModule,
  ],
  templateUrl: './registrations.component.html',
  styleUrl: './registrations.component.scss'
})
export class RegistrationsComponent implements OnInit {
  private svc = inject(ParticipantsService);
  private eventsSvc = inject(EventsService);
  auth = inject(AuthService);
  private toast = inject(ToastService);

  loading = signal(true);
  allParticipants = signal<Participant[]>([]);
  filtered = signal<Participant[]>([]);
  events = signal<Event[]>([]);
  expandedId = signal<number | null>(null);

  searchTerm = '';
  selectedEventId: number | null = null;
  selectedStatus: CertificationStatus | null = null;
  selectedTrainerId: number | null = null;

  columns = ['participant', 'event', 'trainer', 'contact', 'age', 'status', 'date', 'actions'];

  get trainers(): TrainerRef[] {
    const map = new Map<number, TrainerRef>();
    this.events().forEach(e => e.trainers.forEach(t => map.set(t.id, t)));
    return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
  }

  ngOnInit(): void {
    this.svc.getAll().subscribe({
      next: data => {
        this.allParticipants.set(data);
        this.filtered.set(data);
        this.loading.set(false);
      },
    });
    this.eventsSvc.getAll().subscribe({
      next: resp => this.events.set(resp.data),
    });
  }

  applyFilters(): void {
    let result = [...this.allParticipants()];
    if (this.searchTerm.trim()) {
      const q = this.searchTerm.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) || p.documentId.includes(q) || p.email?.toLowerCase().includes(q) || ''
      );
    }
    if (this.selectedEventId) {
      result = result.filter(p => p.eventId === this.selectedEventId);
    }
    if (this.selectedStatus) {
      result = result.filter(p => p.certificationStatus === this.selectedStatus);
    }
    if (this.selectedTrainerId) {
      result = result.filter(p => this.events().find(e => e.id === p.eventId)?.trainers.some(t => t.id === this.selectedTrainerId));
    }
    this.filtered.set(result);
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedEventId = null;
    this.selectedStatus = null;
    this.selectedTrainerId = null;
    this.filtered.set([...this.allParticipants()]);
  }

  trainerNames(eventId: number): string {
    const trainers = this.events().find(e => e.id === eventId)?.trainers ?? [];
    return trainers.length > 0 ? trainers.map(t => t.name).join(', ') : 'Sin asignar';
  }

  toggleDetail(p: Participant): void {
    this.expandedId.set(this.expandedId() === p.id ? null : p.id);
  }

  countByStatus(status: CertificationStatus): number {
    return this.allParticipants().filter(p => p.certificationStatus === status).length;
  }

  eventName(eventId: number): string {
    return this.events().find(e => e.id === eventId)?.name ?? `Evento #${eventId}`;
  }

  initials(name: string): string {
    return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
  }

  certLabel(s: CertificationStatus): string {
    const map: Record<CertificationStatus, string> = { pending: 'Pendiente', approved: 'Aprobado', failed: 'Reprobado' };
    return map[s];
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  delete(p: Participant): void {
    if (!confirm(`¿Eliminar el registro de ${p.name}?`)) return;
    this.svc.delete(p.eventId, p.id).subscribe(() => {
      this.toast.success('Registro eliminado');
      this.allParticipants.update(list => list.filter(x => x.id !== p.id));
      this.applyFilters();
    });
  }

  downloadCertificate(p: Participant): void {
    this.svc.downloadCertificate(p.eventId, p.id).subscribe({
      next: blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Certificado-${p.name.replace(/\s+/g, '_')}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      },
      error: () => this.toast.error('No se pudo generar el certificado'),
    });
  }
}
