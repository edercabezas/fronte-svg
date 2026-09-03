import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { ParticipantsService } from '../../../core/services/participants.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { Participant, CertificationStatus } from '../../../core/models/participant.models';

@Component({
  selector: 'app-participant-list',
  standalone: true,
  imports: [RouterLink, NgClass, MatTableModule, MatButtonModule, MatIconModule, MatChipsModule, MatProgressBarModule, MatTooltipModule, MatCardModule],
  templateUrl: './participant-list.component.html',
  styleUrl: './participant-list.component.scss'
})
export class ParticipantListComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private svc = inject(ParticipantsService);
  auth = inject(AuthService);
  private toast = inject(ToastService);

  loading = signal(true);
  participants = signal<Participant[]>([]);
  eventId!: number;
  columns = ['name', 'company', 'score', 'status', 'actions'];

  ngOnInit(): void {
    this.eventId = Number(this.route.snapshot.paramMap.get('eventId'));
    this.svc.getByEvent(this.eventId).subscribe({ next: data => { this.participants.set(data); this.loading.set(false); } });
  }

  certLabel(s: CertificationStatus): string {
    const map: Record<CertificationStatus, string> = { pending: 'Pendiente', approved: 'Aprobado', failed: 'Reprobado' };
    return map[s];
  }

  delete(p: Participant): void {
    if (!confirm(`¿Eliminar a ${p.name}?`)) return;
    this.svc.delete(this.eventId, p.id).subscribe(() => { this.toast.success('Participante eliminado'); this.participants.update(list => list.filter(x => x.id !== p.id)); });
  }
}
