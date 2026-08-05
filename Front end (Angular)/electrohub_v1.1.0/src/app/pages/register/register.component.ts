import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="container">
        <div class="auth-card animate-slide-up">
          <div class="auth-header">
            <a routerLink="/" class="logo">
              <img src="assets/images/ntg-logo.png" alt="Logo">
              <span>Electro<span>Hub</span></span>
            </a>
            <h1>Create Account</h1>
            <p>Join our community of tech enthusiasts.</p>
          </div>

          <form #regForm="ngForm" (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label>Full Name</label>
              <div class="input-wrapper">
                <i class="fa-regular fa-user"></i>
                <input type="text" name="name" [(ngModel)]="name" required placeholder="John Doe">
              </div>
              <p class="field-error" *ngIf="submitted && !isValidName(name)">
                Full name must be at least 3 characters
              </p>
            </div>

            <div class="form-group">
              <label>Email Address</label>
              <div class="input-wrapper">
                <i class="fa-regular fa-envelope"></i>
                <input type="email" name="email" [(ngModel)]="email" required placeholder="name@company.com">
              </div>
              <p class="field-error" *ngIf="submitted && !isValidEmail(email)">
                Enter a valid email address
              </p>
            </div>

            <div class="form-group">
              <label>Password</label>
              <div class="input-wrapper">
                <i class="fa-solid fa-lock"></i>
                <input type="password" name="password" [(ngModel)]="password" required placeholder="••••••••">
              </div>
              <p class="field-error" *ngIf="submitted && !isValidPassword(password)">
                Password must be at least 6 characters
              </p>
            </div>

            <div class="form-group">
              <label>Phone Number</label>
              <div class="input-wrapper">
                <i class="fa-solid fa-phone"></i>
                <input type="tel" name="phone" [(ngModel)]="phone" placeholder="+1 234 567 8900">
              </div>
              <p class="field-error" *ngIf="submitted && !isValidPhone(phone)">
                Enter a valid phone number
              </p>
            </div>

            <div class="form-group">
              <label>Address</label>
              <div class="input-wrapper">
                <i class="fa-solid fa-map-marker-alt"></i>
                <input type="text" name="address" [(ngModel)]="address" placeholder="123 Tech Avenue, Silicon Valley">
              </div>
              <p class="field-error" *ngIf="submitted && !isValidAddress(address)">
                Address must be at least 6 characters
              </p>
            </div>

            <button type="submit" class="auth-btn">
              Create Account <i class="fa-solid fa-user-plus"></i>
            </button>
            <p class="field-error center" *ngIf="registerError">{{ registerError }}</p>
          </form>

          <div class="auth-footer">
            <p>Already have an account? <a routerLink="/login">Sign in here</a></p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page { min-height: 100vh; display: flex; align-items: center; background: var(--bg-main); padding: 40px 0; }
    .auth-card { max-width: 450px; margin: 0 auto; background: white; padding: 50px; border-radius: var(--radius-lg); box-shadow: var(--shadow-lg); border: 1px solid var(--border); }
    .auth-header { text-align: center; margin-bottom: 40px; }
    .logo { display: inline-flex; align-items: center; gap: 10px; font-size: 1.8rem; font-weight: 800; margin-bottom: 30px; }
    .logo img { height: 40px; }
    .logo span span { color: var(--secondary); }
    .auth-header h1 { font-size: 2rem; margin-bottom: 10px; }
    .auth-header p { color: var(--text-muted); }
    .form-group { margin-bottom: 25px; }
    .form-group label { display: block; font-weight: 600; margin-bottom: 10px; }
    .input-wrapper { position: relative; }
    .input-wrapper i { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: var(--text-muted); }
    .input-wrapper input { width: 100%; padding: 12px 15px 12px 45px; border-radius: var(--radius-md); border: 1px solid var(--border); outline: none; transition: all 0.2s; }
    .input-wrapper input:focus { border-color: var(--secondary); box-shadow: 0 0 0 4px rgba(15, 23, 42, 0.1); }
    .auth-btn { width: 100%; background: var(--secondary); color: white; padding: 15px; border-radius: var(--radius-md); font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 10px; }
    .auth-btn:hover:not(:disabled) { background: var(--secondary-light); transform: translateY(-2px); }
    .auth-footer { margin-top: 30px; text-align: center; font-size: 0.95rem; color: var(--text-muted); }
    .auth-footer a { color: var(--secondary); font-weight: 700; }
    .field-error { color: #b91c1c; font-size: 0.85rem; font-weight: 700; margin: 8px 0 0; }
    .field-error.center { text-align: center; margin-top: 14px; }
  `]
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  name = '';
  email = '';
  password = '';
  phone = '';
  address = '';
  registerError = '';
  submitted = false;

  onSubmit() {
    this.submitted = true;
    this.registerError = '';
    if (!this.isValidForm()) {
      this.registerError = 'Please fix the highlighted fields.';
      return;
    }
    this.authService.register({ 
      name: this.name, 
      email: this.email, 
      password: this.password,
      phone: this.phone,
      address: this.address
    }).subscribe(
      (user) => {
        this.authService.setCurrentUser(user);
        this.router.navigate(['/']);
      },
      (error) => {
        console.error('Registration error:', error);
        this.registerError = 'Registration failed. Please check your details.';
      }
    );
  }

  isValidName(value: string): boolean {
    return value.trim().length >= 3;
  }

  isValidEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
  }

  isValidPassword(value: string): boolean {
    return value.length >= 6;
  }

  isValidPhone(value: string): boolean {
    const normalized = value.trim().replace(/[\s-]/g, '');
    return /^\+?\d{8,15}$/.test(normalized);
  }

  isValidAddress(value: string): boolean {
    return value.trim().length >= 6;
  }

  private isValidForm(): boolean {
    return this.isValidName(this.name)
      && this.isValidEmail(this.email)
      && this.isValidPassword(this.password)
      && this.isValidPhone(this.phone)
      && this.isValidAddress(this.address);
  }
}
