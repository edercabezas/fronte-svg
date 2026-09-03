import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ReportsService } from '../../../core/services/reports.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-report-center',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule, MatCardModule, MatProgressBarModule],
  templateUrl: './report-center.component.html',
  styleUrl: './report-center.component.scss'
})
export class ReportCenterComponent {
  private route = inject(ActivatedRoute);
  private svc = inject(ReportsService);
  auth = inject(AuthService);
  private toast = inject(ToastService);

  eventId = Number(this.route.snapshot.paramMap.get('eventId'));
  downloading = signal<string | null>(null);

  availableReports = [
    {
      key: 'factory', title: 'Reporte de Fábrica', icon: 'factory',
      color: 'linear-gradient(135deg, #0f3460, #1a4a8a)',
      description: 'Reporte oficial del evento para presentar a fábrica.',
      includes: ['Información general del evento', 'Lista de participantes y calificaciones', 'Fotografías de evidencia', 'Resumen de certificados'],
      managerOnly: false, hasExcel: true,
    },
    {
      key: 'admin', title: 'Reporte Administrativo', icon: 'business_center',
      color: 'linear-gradient(135deg, #e94560, #c73652)',
      description: 'Reporte completo con costos y gastos del evento. Solo para administradores.',
      includes: ['Todo el contenido del reporte de fábrica', 'Detalle de gastos por categoría', 'Resumen de costos totales', 'Análisis financiero del evento'],
      managerOnly: true, hasExcel: true,
    },
  ];

  download(key: string): void {
    this.downloading.set(key);
    const obs = key === 'admin' ? this.svc.downloadAdminReport(this.eventId) : this.svc.downloadFactoryReport(this.eventId);
    obs.subscribe({
      next: blob => { this.svc.triggerDownload(blob, `reporte-${key}-evento-${this.eventId}.pdf`); this.toast.success('Reporte descargado'); this.downloading.set(null); },
      error: () => { this.toast.error('Error al generar reporte'); this.downloading.set(null); },
    });
  }

  downloadExcel(key: string): void {
    this.downloading.set(key + '_excel');
    const obs = key === 'admin' ? this.svc.exportExpenses(this.eventId) : this.svc.exportParticipants(this.eventId);
    obs.subscribe({
      next: blob => { this.svc.triggerDownload(blob, `${key}-evento-${this.eventId}.xlsx`); this.toast.success('Excel descargado'); this.downloading.set(null); },
    });
  }
}
