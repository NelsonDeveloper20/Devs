import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkTheme: boolean = false;

  constructor() {
    const savedTheme = localStorage.getItem('dark-theme');
    this.darkTheme = savedTheme === 'true';
    this.applyTheme();
  }

  toggleTheme(): void {
    this.darkTheme = !this.darkTheme;
    localStorage.setItem('dark-theme', this.darkTheme.toString());
    this.applyTheme();
  }

  isDarkTheme(): boolean {
    return this.darkTheme;
  }

  private applyTheme(): void {
    if (this.darkTheme) {
      document.body.classList.add('dark-mode', 'dark-theme');
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode', 'dark-theme');
    }
  }
}