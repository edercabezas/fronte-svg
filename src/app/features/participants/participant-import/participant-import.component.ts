import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatListModule } from '@angular/material/list';
import { ParticipantsService } from '../../../core/services/participants.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-participant-import',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule, MatCardModule, MatProgressBarModule, MatListModule],
  templateUrl: './participant-import.component.html',
  styleUrl: './participant-import.component.scss'
})
export class ParticipantImportComponent {
  private route = inject(ActivatedRoute);
  private svc = inject(ParticipantsService);
  private toast = inject(ToastService);
  private router = inject(Router);

  eventId = Number(this.route.snapshot.paramMap.get('eventId'));
  selectedFile = signal<File | null>(null);
  uploading = signal(false);
  result = signal<any>(null);

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) { this.selectedFile.set(file); this.result.set(null); }
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file) { this.selectedFile.set(file); this.result.set(null); }
  }

  upload(): void {
    if (!this.selectedFile()) return;
    this.uploading.set(true);
    this.svc.importExcel(this.eventId, this.selectedFile()!).subscribe({
      next: res => { this.result.set(res); this.uploading.set(false); this.toast.success(`${res.success} participantes importados`); },
      error: () => { this.toast.error('Error al importar'); this.uploading.set(false); },
    });
  }
}
