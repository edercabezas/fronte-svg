import { Component, inject, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../core/services/auth.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  adminOnly?: boolean;
}

const CARGADOR_NAV_ITEMS: NavItem[] = [
  { label: 'Nuevo Evento', icon: 'add_circle', route: '/events/new' },
  { label: 'Carga masiva', icon: 'upload_file', route: '/events/import' },
];

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatIconModule, MatTooltipModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  collapsed = input<boolean>(false);
  auth = inject(AuthService);

  private readonly navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Eventos', icon: 'event', route: '/events' },
    { label: 'Registros', icon: 'how_to_reg', route: '/registrations' },
    { label: 'Usuarios', icon: 'manage_accounts', route: '/users', adminOnly: true },
  ];

  get visibleItems(): NavItem[] {
    // El cargador solo puede crear eventos: no ve el resto del menú
    if (this.auth.isCargador()) return CARGADOR_NAV_ITEMS;
    return this.navItems.filter(item => !item.adminOnly || this.auth.isAdmin());
  }
}
