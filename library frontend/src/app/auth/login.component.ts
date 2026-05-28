import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styles: [`
    .login-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      background: #f8fafc;
    }

    .login-card {
      width: 100%;
      max-width: 420px;
      padding: 2rem;
      background: #fff;
      border: 1px solid rgba(15, 23, 42, 0.08);
      border-radius: 14px;
      box-shadow: 0 12px 35px rgba(15, 23, 42, 0.08);
    }

    .login-header {
      text-align: center;
      margin-bottom: 1.75rem;
    }

    .login-logo {
      width: 58px;
      height: 58px;
      display: inline-grid;
      place-items: center;
      margin-bottom: 1rem;
      border-radius: 14px;
      background: #6366f1;
      color: #fff;
      font-size: 1.5rem;
    }

    .login-title {
      margin: 0 0 0.25rem;
      color: #0f172a;
      font-size: 1.55rem;
      font-weight: 700;
    }

    .login-subtitle {
      margin: 0;
      color: #64748b;
      font-size: 0.88rem;
    }

    .login-form,
    .form-group {
      display: flex;
      flex-direction: column;
    }

    .login-form {
      gap: 1.1rem;
    }

    .form-group {
      gap: 0.4rem;
    }

    .form-label {
      color: #475569;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .input-wrapper {
      position: relative;
    }

    .input-icon {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      color: #64748b;
    }

    .form-input {
      width: 100%;
      padding: 0.75rem 1rem 0.75rem 2.6rem;
      border: 1px solid rgba(15, 23, 42, 0.12);
      border-radius: 10px;
      background: #f8fafc;
      color: #0f172a;
      outline: none;
    }

    .form-input:focus {
      border-color: #6366f1;
      background: #fff;
    }

    .error-banner {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      border-radius: 10px;
      background: #fee2e2;
      color: #b91c1c;
      font-size: 0.85rem;
    }

    .login-btn {
      width: 100%;
      margin-top: 0.25rem;
      padding: 0.85rem;
      border: 0;
      border-radius: 10px;
      background: #6366f1;
      color: #fff;
      font-weight: 700;
      cursor: pointer;
    }

    .login-btn:not(:disabled):hover {
      background: #4f46e5;
    }

    .login-btn:disabled {
      opacity: 0.55;
      cursor: not-allowed;
    }

    .btn-content,
    .btn-loading {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .loading-spinner {
      width: 18px;
      height: 18px;
      border: 2px solid rgba(255, 255, 255, 0.35);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }

    .login-footer {
      margin-top: 1.5rem;
      text-align: center;
      color: #64748b;
      font-size: 0.78rem;
    }

    .login-footer p {
      margin: 0;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @media (max-width: 480px) {
      .login-card {
        padding: 1.5rem;
      }
    }
  `]
})
export class LoginComponent {
  loading = false;
  errorMessage = '';

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  constructor(private fb: FormBuilder,
              private auth: AuthService,
              private router: Router) {
    if (this.auth.isAuthenticated()) {
      this.redirectToDashboard();
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;
    this.loading = true;
    this.errorMessage = '';
    const { username, password } = this.loginForm.value;
    this.auth.login(username!, password!)
      .pipe(tap(() => this.loading = false))
      .subscribe({
        next: () => {
          this.redirectToDashboard();
        },
        error: err => {
          this.errorMessage = err.error?.message || err.message || 'Login failed. Please check your credentials.';
          this.loading = false;
        }
      });
  }

  private redirectToDashboard(): void {
    const role = this.auth.getRole();
    if (role === 'ADMIN') this.router.navigate(['/admin-dashboard']);
    else if (role === 'LIBRARIAN') this.router.navigate(['/librarian-dashboard']);
    else this.router.navigate(['/user-dashboard']);
  }
}
