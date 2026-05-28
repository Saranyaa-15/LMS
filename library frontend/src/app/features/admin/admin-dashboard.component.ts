import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { BookService } from '../../core/services/book.service';
import { MemberService } from '../../core/services/member.service';
import { AuthService } from '../../auth/auth.service';
import { Role } from '../../shared/models/role.enum';
import { SpinnerComponent } from '../../shared/components/spinner.component';
import { AlertComponent } from '../../shared/components/alert/alert.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, SpinnerComponent, AlertComponent],
  templateUrl: './admin-dashboard.component.html',
  styles: [`
    .dash-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .dash-greeting {
      font-size: 0.82rem;
      font-weight: 500;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 0.25rem;
    }
    .dash-title {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--text-heading);
      margin: 0 0 0.35rem;
      letter-spacing: -0.3px;
    }
    .dash-subtitle {
      font-size: 0.88rem;
      color: #64748b;
      margin: 0;
    }
    .dash-date {
      padding: 0.5rem 1rem;
      border-radius: 10px;
      background: rgba(99, 102, 241, 0.08);
      border: 1px solid rgba(99, 102, 241, 0.15);
      color: #a5b4fc;
      font-size: 0.82rem;
      font-weight: 500;
      white-space: nowrap;
    }

    .stat-icon {
      width: 48px; height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      flex-shrink: 0;
    }
    .stat-icon-primary, .stat-icon-success, .stat-icon-info, .stat-icon-warning {
      background: var(--bg-muted);
      color: var(--text-primary);
      border: 1px solid var(--border-color);
    }

    .action-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.6rem;
      padding: 1.25rem 0.75rem;
      border-radius: 14px;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.85rem;
      transition: none;
      text-align: center;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      color: var(--text-primary);
    }
    .action-card i { font-size: 1.5rem; color: var(--text-primary); }
    .action-card:hover {
      transform: none;
      box-shadow: none;
    }
    .action-primary,
    .action-success,
    .action-warning,
    .action-info {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      color: var(--text-primary);
    }

    .info-box {
      padding: 0.85rem 1rem;
      border-radius: 10px;
      background: rgba(99, 102, 241, 0.06);
      border: 1px solid rgba(99, 102, 241, 0.1);
      font-size: 0.82rem;
      color: #94a3b8;
      display: flex;
      align-items: center;
    }

    @media (max-width: 768px) {
      .dash-header { flex-direction: column; }
      .dash-title { font-size: 1.25rem; }
      .action-card { padding: 1rem 0.5rem; font-size: 0.78rem; }
      .action-card i { font-size: 1.25rem; }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  loading = true;
  totalBooks = 0;
  availableBooks = 0;
  totalMembers = 0;
  activeMembers = 0;
  today = new Date();

  registerForm: FormGroup;
  roles = Object.values(Role);
  submitting = false;
  successMsg: string | null = null;
  errorMsg: string | null = null;

  constructor(
    private fb: FormBuilder,
    private bookSvc: BookService,
    private memberSvc: MemberService,
    private authSvc: AuthService
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: [Role.USER, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.loading = true;
    forkJoin({
      books: this.bookSvc.getAll(),
      members: this.memberSvc.getAll()
    }).subscribe({
      next: ({ books, members }) => {
        this.totalBooks = books.length;
        this.availableBooks = books.filter(b => b.availableCopies > 0).length;
        this.totalMembers = members.length;
        this.activeMembers = members.filter(m => m.status === 'ACTIVE').length;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading stats:', err);
        this.loading = false;
      }
    });
  }

  onSubmitUser(): void {
    if (this.registerForm.invalid) return;
    this.submitting = true;
    this.successMsg = null;
    this.errorMsg = null;

    this.authSvc.register(this.registerForm.value).subscribe({
      next: () => {
        this.successMsg = `User "${this.registerForm.value.username}" registered successfully with role ${this.registerForm.value.role}.`;
        this.registerForm.reset({ role: Role.USER });
        this.submitting = false;
      },
      error: (err) => {
        this.errorMsg = err.message || 'Registration failed.';
        this.submitting = false;
      }
    });
  }
}
