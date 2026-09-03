import { Component, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { Chart, CategoryScale, LinearScale, BarElement, ArcElement, BarController, PieController, Tooltip, Legend, Title } from 'chart.js';
import { DashboardService } from '../../core/services/dashboard.service';
import { DashboardStats, DashboardCharts, UpcomingEvent } from '../../core/models/dashboard.models';
import { AuthService } from '../../core/services/auth.service';

Chart.register(CategoryScale, LinearScale, BarElement, ArcElement, BarController, PieController, Tooltip, Legend, Title);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CurrencyPipe, NgClass, RouterLink, MatCardModule, MatIconModule, MatButtonModule, MatProgressBarModule, MatChipsModule, BaseChartDirective],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private service = inject(DashboardService);
  auth = inject(AuthService);

  loading = signal(true);
  stats = signal<DashboardStats | null>(null);
  charts = signal<DashboardCharts | null>(null);
  upcomingEvents = signal<UpcomingEvent[]>([]);

  barOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: { legend: { display: true, position: 'bottom' } },
    scales: { x: { stacked: false }, y: { stacked: false, beginAtZero: true, ticks: { precision: 0 } } },
  };
  pieOptions: ChartConfiguration['options'] = { responsive: true };

  barChartData(ch: DashboardCharts): ChartConfiguration['data'] {
    return {
      labels: ch.certificationsByMonth.map(d => d.label),
      datasets: [
        { data: ch.certificationsByMonth.map(d => d.approved), label: 'Certificados', backgroundColor: '#34a853', borderRadius: 6 },
        { data: ch.certificationsByMonth.map(d => d.pending), label: 'Pendientes', backgroundColor: '#f2b705', borderRadius: 6 },
        { data: ch.certificationsByMonth.map(d => d.failed), label: 'Reprobados', backgroundColor: '#e94560', borderRadius: 6 },
      ]
    };
  }

  pieChartData(ch: DashboardCharts): ChartConfiguration['data'] {
    return {
      labels: ch.costsByCategory.map(d => d.label),
      datasets: [{ data: ch.costsByCategory.map(d => d.value), backgroundColor: ['#e94560', '#0f3460', '#34a853'] }]
    };
  }

  rate(count: number, total: number): number {
    return total > 0 ? Math.round((count / total) * 100) : 0;
  }

  ngOnInit(): void {
    this.service.getStats().subscribe(s => { this.stats.set(s); this.loading.set(false); });
    this.service.getCharts().subscribe(ch => this.charts.set(ch));
    this.service.getUpcomingEvents().subscribe(ev => this.upcomingEvents.set(ev));
  }
}
