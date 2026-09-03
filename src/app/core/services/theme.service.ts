import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly KEY = 'certplatform-theme';
  isDark = signal(false);

  init(): void {
    const saved = localStorage.getItem(this.KEY);
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
    const dark = saved ? saved === 'dark' : prefersDark;
    this.isDark.set(dark);
    this.apply(dark);
  }

  toggle(): void {
    const next = !this.isDark();
    this.isDark.set(next);
    this.apply(next);
    localStorage.setItem(this.KEY, next ? 'dark' : 'light');
  }

  private apply(dark: boolean): void {
    document.body.classList.toggle('dark-theme', dark);
    document.body.classList.toggle('light-theme', !dark);
  }
}
