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
import { UsersService } from '../../../core/services/users.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, MatInputModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatSelectModule, MatCardModule, MatProgressSpinnerModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private svc = inject(UsersService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toast = inject(ToastService);

  loading = signal(false);
  isEdit = false;
  userId?: number;

  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: [''],
    role: ['capacitador', Validators.required],
  });

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id')) || undefined;
    this.isEdit = !!this.userId && !isNaN(this.userId);
    if (this.isEdit) {
      this.svc.getById(this.userId!).subscribe(u => this.form.patchValue(u as any));
    }
    if (!this.isEdit) this.form.get('password')?.setValidators(Validators.required);
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    const payload = this.form.value as any;
    const obs = this.isEdit ? this.svc.update(this.userId!, payload) : this.svc.create(payload);
    obs.subscribe({
      next: () => { this.toast.success('Usuario guardado'); this.router.navigate(['/users']); },
      error: () => { this.toast.error('Error al guardar'); this.loading.set(false); },
    });
  }
}
