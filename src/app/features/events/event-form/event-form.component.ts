import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EventsService } from '../../../core/services/events.service';
import { TemplatesService } from '../../../core/services/templates.service';
import { UsersService } from '../../../core/services/users.service';
import { ToastService } from '../../../core/services/toast.service';
import { CertificationTemplate } from '../../../core/models/template.models';
import { User } from '../../../core/models/user.models';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, MatInputModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatDatepickerModule, MatNativeDateModule, MatSelectModule, MatCardModule, MatProgressSpinnerModule],
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.scss'
})
export class EventFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private svc = inject(EventsService);
  private templatesSvc = inject(TemplatesService);
  private usersSvc = inject(UsersService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toast = inject(ToastService);

  loading = signal(false);
  isEdit = false;
  eventId?: number;
  templates = signal<CertificationTemplate[]>([]);
  trainers = signal<User[]>([]);
  modalities = ['Presencial', 'Virtual', 'Mixta'];

  form = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    location: [''],
    city: ['', Validators.required],
    startDate: [null, Validators.required],
    endDate: [null, Validators.required],
    modality: ['Presencial', Validators.required],
    maxCapacity: [20, [Validators.required, Validators.min(1)]],
    templateId: [null as number | null, Validators.required],
    trainerIds: [[] as number[]],
  });

  ngOnInit(): void {
    this.templatesSvc.getAll().subscribe(templates => {
      this.templates.set(templates);
      if (!this.isEdit && templates.length > 0) {
        this.form.patchValue({ templateId: templates[0].id });
      }
    });

    this.usersSvc.getTrainers().subscribe(trainers => this.trainers.set(trainers));

    this.eventId = Number(this.route.snapshot.paramMap.get('id')) || undefined;
    this.isEdit = !!this.eventId && !isNaN(this.eventId);
    if (this.isEdit) {
      this.svc.getById(this.eventId!).subscribe(event => {
        this.form.patchValue({ ...event, startDate: new Date(event.startDate) as any, endDate: new Date(event.endDate) as any });
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    const payload = { ...this.form.value, startDate: new Date(this.form.value.startDate!).toISOString(), endDate: new Date(this.form.value.endDate!).toISOString() } as any;
    const obs = this.isEdit ? this.svc.update(this.eventId!, payload) : this.svc.create(payload);
    obs.subscribe({
      next: (ev) => { this.toast.success(this.isEdit ? 'Evento actualizado' : 'Evento creado'); this.router.navigate(['/events', ev.id]); },
      error: () => { this.toast.error('Error al guardar'); this.loading.set(false); },
    });
  }
}
