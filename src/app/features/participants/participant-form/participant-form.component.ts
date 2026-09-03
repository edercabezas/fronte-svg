import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ParticipantsService } from '../../../core/services/participants.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-participant-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, MatInputModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatSelectModule, MatCardModule, MatProgressSpinnerModule],
  templateUrl: './participant-form.component.html',
  styleUrl: './participant-form.component.scss'
})
export class ParticipantFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private svc = inject(ParticipantsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toast = inject(ToastService);

  loading = signal(false);
  isEdit = false;
  eventId!: number;
  participantId?: number;

  form = this.fb.group({
    name: ['', Validators.required],
    documentId: ['', Validators.required],
    email: [''],
    phone: [''],
    company: [''],
    position: [''],
    score: [null as number | null],
    certificationStatus: ['pending'],
  });

  ngOnInit(): void {
    this.eventId = Number(this.route.snapshot.paramMap.get('eventId'));
    this.participantId = Number(this.route.snapshot.paramMap.get('id')) || undefined;
    this.isEdit = !!this.participantId && !isNaN(this.participantId);
    if (this.isEdit) {
      this.svc.getByEvent(this.eventId).subscribe(list => {
        const p = list.find(x => x.id === this.participantId);
        if (p) this.form.patchValue(p as any);
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    const payload = this.form.value as any;
    const obs = this.isEdit
      ? this.svc.update(this.eventId, this.participantId!, payload)
      : this.svc.create(this.eventId, payload);
    obs.subscribe({
      next: () => { this.toast.success('Guardado correctamente'); this.router.navigate(['/events', this.eventId, 'participants']); },
      error: () => { this.toast.error('Error al guardar'); this.loading.set(false); },
    });
  }
}
