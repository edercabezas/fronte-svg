import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatStepperModule } from '@angular/material/stepper';
import { MatChipsModule } from '@angular/material/chips';
import { EventsService } from '../../../core/services/events.service';
import { ParticipantsService } from '../../../core/services/participants.service';
import { Event } from '../../../core/models/event.models';
import { DocumentType } from '../../../core/models/participant.models';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    ReactiveFormsModule, RouterLink, NgClass,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatIconModule, MatProgressSpinnerModule,
    MatStepperModule, MatChipsModule,
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent implements OnInit {
  private fb = inject(FormBuilder);
  private eventsSvc = inject(EventsService);
  private participantsSvc = inject(ParticipantsService);

  events = signal<Event[]>([]);
  loadingEvents = signal(true);
  loading = signal(false);
  registrationSuccess = signal(false);
  errorMsg = signal<string | null>(null);
  currentStep = signal(1);

  documentTypes: { value: DocumentType; label: string }[] = [
    { value: 'CC', label: 'CC — Cédula de Ciudadanía' },
    { value: 'CE', label: 'CE — Cédula de Extranjería' },
    { value: 'TI', label: 'TI — Tarjeta de Identidad' },
    { value: 'PA', label: 'PA — Pasaporte' },
    { value: 'RC', label: 'RC — Registro Civil' },
  ];

  form = this.fb.group({
    event: this.fb.group({
      eventId: [null as number | null, Validators.required],
    }),
    personal: this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      documentType: ['CC' as DocumentType, Validators.required],
      documentId: ['', [Validators.required, Validators.minLength(5)]],
    }),
    contact: this.fb.group({
      phone: ['', [Validators.required, Validators.pattern(/^[0-9+\s\-]{7,15}$/)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required, Validators.minLength(8)]],
    }),
  });

  selectedEventName = computed(() => {
    const id = this.form.get('event.eventId')?.value;
    return this.events().find(e => e.id === id)?.name ?? '—';
  });

  selectedEvent = computed(() => {
    const id = this.form.get('event.eventId')?.value;
    return this.events().find(e => e.id === id);
  });

  ngOnInit(): void {
    this.eventsSvc.getPublicEvents().subscribe({
      next: data => { this.events.set(data); this.loadingEvents.set(false); },
      error: () => this.loadingEvents.set(false),
    });
  }

  onStepChange(e: any): void {
    this.currentStep.set(e.selectedIndex + 1);
  }

  selectEvent(event: Event): void {
    this.form.get('event.eventId')?.setValue(event.id);
    this.form.get('event.eventId')?.markAsTouched();
  }

  hasError(path: string, error: string): boolean {
    const ctrl = this.form.get(path);
    return !!(ctrl?.hasError(error) && ctrl?.touched);
  }

  formatDate(dateStr: string | Date | null | undefined): string {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    this.errorMsg.set(null);

    const { event, personal, contact } = this.form.value;

    const payload = {
      eventId: event!.eventId!,
      name: personal!.name!,
      documentType: personal!.documentType!,
      documentId: personal!.documentId!,
      phone: contact!.phone!,
      email: contact!.email!,
      address: contact!.address!,
    };

    try {
      this.participantsSvc.registerPublic(payload).subscribe({
        next: () => { this.registrationSuccess.set(true); this.loading.set(false); },
        error: (err) => { this.errorMsg.set(err?.error?.message ?? err?.message ?? 'Error al registrar. Intenta nuevamente.'); this.loading.set(false); },
      });
    } catch (e: any) {
      this.errorMsg.set(e?.message ?? 'Ya estás registrado en este evento.');
      this.loading.set(false);
    }
  }

  resetForm(): void {
    this.form.reset({ personal: { documentType: 'CC' } });
    this.registrationSuccess.set(false);
    this.errorMsg.set(null);
  }
}
