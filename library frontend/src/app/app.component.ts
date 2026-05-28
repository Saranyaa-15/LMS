import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  navOpen = false;
  isDarkMode = false;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.applyTheme();
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme();
  }

  private applyTheme(): void {
    const root = document.documentElement;
    root.classList.toggle('dark-theme', this.isDarkMode);
    root.classList.toggle('light-theme', !this.isDarkMode);
  }

  isAuthenticated(): boolean {
    return this.auth.isAuthenticated() && this.router.url !== '/login';
  }

  getRole(): string | null {
    return this.auth.getRole();
  }

  getDashboardLink(): string {
    const role = this.getRole();
    if (role === 'ADMIN') return '/admin-dashboard';
    if (role === 'LIBRARIAN') return '/librarian-dashboard';
    return '/user-dashboard';
  }

  logout(): void {
    this.navOpen = false;
    this.auth.logout();
  }
}
