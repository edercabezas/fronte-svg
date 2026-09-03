import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EvidenceService } from '../../../core/services/evidence.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { EvidenceFile, EvidenceType } from '../../../core/models/evidence.models';

@Component({
  selector: 'app-evidence-gallery',
  standalone: true,
  imports: [RouterLink, NgClass, MatButtonModule, MatIconModule, MatCardModule, MatProgressBarModule, MatChipsModule, MatTooltipModule],
  templateUrl: './evidence-gallery.component.html',
  styleUrl: './evidence-gallery.component.scss'
})
export class EvidenceGalleryComponent implements OnInit {
  private route = inject(ActivatedRoute);
  svc = inject(EvidenceService);
  auth = inject(AuthService);
  private toast = inject(ToastService);

  eventId = Number(this.route.snapshot.paramMap.get('eventId'));
  loading = signal(true);
  uploading = signal(false);
  evidence = signal<EvidenceFile[]>([]);
  activeFilter = signal<EvidenceType | ''>('');

  filterOptions = [
    { value: '' as const, label: 'Todos', icon: 'all_inclusive' },
    { value: 'photo' as EvidenceType, label: 'Fotos', icon: 'photo' },
    { value: 'document' as EvidenceType, label: 'Documentos', icon: 'description' },
    { value: 'excel' as EvidenceType, label: 'Excel', icon: 'table_chart' },
  ];

  get photos(): any { return () => this.evidence().filter(e => e.type === 'photo'); }
  get documents(): any { return () => this.evidence().filter(e => e.type !== 'photo'); }

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    this.svc.getByEvent(this.eventId, this.activeFilter() || undefined).subscribe({ next: data => { this.evidence.set(data); this.loading.set(false); } });
  }

  setFilter(v: EvidenceType | ''): void { this.activeFilter.set(v); this.load(); }

  typeIcon(type: EvidenceType): string {
    const map: Record<EvidenceType, string> = { photo: 'image', document: 'description', excel: 'table_chart', other: 'insert_drive_file' };
    return map[type];
  }

  onFilesSelected(event: Event): void {
    const files = Array.from((event.target as HTMLInputElement).files ?? []);
    if (!files.length) return;
    this.uploading.set(true);
    this.svc.upload(this.eventId, files).subscribe({
      next: () => { this.toast.success(`${files.length} archivo(s) subido(s)`); this.uploading.set(false); this.load(); },
      error: () => { this.toast.error('Error al subir archivos'); this.uploading.set(false); },
    });
  }

  delete(file: EvidenceFile): void {
    if (!confirm(`¿Eliminar "${file.originalName}"?`)) return;
    this.svc.delete(file.id).subscribe(() => { this.toast.success('Archivo eliminado'); this.evidence.update(list => list.filter(e => e.id !== file.id)); });
  }
}
