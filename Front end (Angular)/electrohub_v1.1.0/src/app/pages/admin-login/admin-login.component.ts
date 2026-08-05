import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AdminAuthService } from '../../services/admin-auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <main class="admin-login-page">
      <section class="login-card">
        <a routerLink="/" class="brand">
          <img src="assets/images/ntg-logo.png" alt="ElectroHub Logo">
          <span>Electro<span>Hub</span></span>
        </a>

        <div class="login-header">
          <p>Admin Access</p>
          <h1>Control Dashboard</h1>
        </div>

        <form #adminForm="ngForm" (ngSubmit)="onSubmit()">
          <label>
            Username
            <div class="input-wrap">
              <i class="fa-regular fa-user"></i>
              <input name="username" [(ngModel)]="username" required autocomplete="username">
            </div>
          </label>

          <label>
            Password
            <div class="input-wrap">
              <i class="fa-solid fa-lock"></i>
              <input type="password" name="password" [(ngModel)]="password" required autocomplete="current-password">
            </div>
          </label>

          <p class="error" *ngIf="errorMessage">{{ errorMessage }}</p>

          <button type="submit" [disabled]="!adminForm.valid || isLoading">
            <span>{{ isLoading ? 'Checking...' : 'Open Admin' }}</span>
            <i class="fa-solid fa-arrow-right"></i>
          </button>
        </form>
      </section>
    </main>
  `,
  styles: [`
    .admin-login-page {
      min-height: 100vh;
      display: grid;
      place-items: center;
      padding: 28px;
      background:
        linear-gradient(135deg, rgba(185, 28, 28, .08), transparent 34%),
        var(--bg-main);
    }
    .login-card {
      width: min(100%, 460px);
      background: #fff;
      border: 1px solid var(--border);
      border-radius: 18px;
      box-shadow: var(--shadow-lg);
      padding: 34px;
    }
    .brand {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      font-size: 1.55rem;
      font-weight: 900;
      margin-bottom: 28px;
    }
    .brand img { width: 48px; height: 48px; object-fit: contain; }
    .brand span span { color: var(--primary); }
    .login-header p {
      color: var(--primary);
      font-size: .78rem;
      font-weight: 900;
      letter-spacing: .08em;
      margin: 0 0 8px;
      text-transform: uppercase;
    }
    .login-header h1 { margin: 0 0 26px; font-size: 2rem; }
    form { display: grid; gap: 18px; }
    label { display: grid; gap: 8px; font-weight: 800; color: var(--text-main); }
    .input-wrap { position: relative; }
    .input-wrap i {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-muted);
    }
    input {
      width: 100%;
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 13px 14px 13px 42px;
      font: inherit;
      outline: none;
    }
    input:focus {
      border-color: var(--secondary);
      box-shadow: 0 0 0 4px rgba(15, 23, 42, .08);
    }
    button {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      border: 0;
      border-radius: 12px;
      padding: 14px 16px;
      background: var(--secondary);
      color: #fff;
      font-weight: 900;
      cursor: pointer;
    }
    button:disabled { opacity: .6; cursor: not-allowed; }
    .error {
      margin: 0;
      color: #b91c1c;
      font-weight: 800;
      font-size: .92rem;
    }
  `]
})
export class AdminLoginComponent {
  private adminAuthService = inject(AdminAuthService);
  private router = inject(Router);

  username = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  onSubmit(): void {
    this.errorMessage = '';
    this.isLoading = true;
    this.adminAuthService.login(this.username.trim(), this.password).subscribe({
      next: admin => {
        this.adminAuthService.setCurrentAdmin(admin);
        this.router.navigate(['/admin']);
      },
      error: () => {
        this.errorMessage = 'Username or password is wrong.';
        this.isLoading = false;
      }
    });
  }
}
