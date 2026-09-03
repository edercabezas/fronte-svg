import { Component, inject, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { EventsService } from '../../../core/services/events.service';
import { ToastService } from '../../../core/services/toast.service';
import { BulkImportResult } from '../../../core/models/event.models';

@Component({
  selector: 'app-event-import',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule, MatCardModule, MatProgressBarModule],
  templateUrl: './event-import.component.html',
  styleUrl: './event-import.component.scss'
})
export class EventImportComponent {
  private svc = inject(EventsService);
  private toast = inject(ToastService);
  private router = inject(Router);

  selectedFile = signal<File | null>(null);
  uploading = signal(false);
  result = signal<BulkImportResult | null>(null);

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
    this.svc.importBulk(this.selectedFile()!).subscribe({
      next: res => { this.result.set(res); this.uploading.set(false); this.toast.success(`${res.success} eventos importados`); },
      error: () => { this.toast.error('Error al importar'); this.uploading.set(false); },
    });
  }

  downloadTemplate(): void {
    this.svc.downloadBulkTemplate().subscribe({
      next: blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'plantilla-carga-masiva-eventos.xlsx';
        a.click();
        URL.revokeObjectURL(url);
      },
      error: () => this.toast.error('No se pudo descargar la plantilla'),
    });
  }
}
