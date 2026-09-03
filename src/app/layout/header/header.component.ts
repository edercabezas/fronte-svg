import { Component, inject, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { ROLE_LABELS, UserRole } from '../../core/models/user.models';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatMenuModule, MatTooltipModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  title = input<string>('Panel de Control');
  toggleSidebar = output<void>();
  auth = inject(AuthService);
  theme = inject(ThemeService);

  get userInitial(): string {
    return this.auth.currentUser()?.name?.charAt(0)?.toUpperCase() ?? 'U';
  }

  roleLabel(role: UserRole): string {
    return ROLE_LABELS[role];
  }
}
