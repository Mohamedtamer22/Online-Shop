import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
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
            <h1>Welcome Back</h1>
            <p>Please enter your details to sign in.</p>
          </div>

          <form #loginForm="ngForm" (ngSubmit)="onSubmit()">
            <!-- Email Field -->
            <div class="form-group">
              <label>Email Address</label>
              <div class="input-wrapper" [class.error]="submitted && !isValidEmail(email)">
                <i class="fa-regular fa-envelope"></i>
                <input 
                  type="email" 
                  name="email" 
                  [(ngModel)]="email" 
                  required 
                  placeholder="name@gmail.com"
                  (input)="onFieldChange()"
                >
              </div>
              <p class="field-error" *ngIf="submitted && !isValidEmail(email)">
                {{ getEmailErrorMessage() }}
              </p>
            </div>

            <!-- Password Field -->
            <div class="form-group">
              <label>Password</label>
              <div class="input-wrapper" [class.error]="submitted && !isValidPassword(password)">
                <i class="fa-solid fa-lock"></i>
                <input 
                  type="password" 
                  name="password" 
                  [(ngModel)]="password" 
                  required 
                  placeholder="••••••••"
                  (input)="onFieldChange()"
                >
              </div>
              <p class="field-error" *ngIf="submitted && !isValidPassword(password)">
                Password must be at least 8 characters and contain uppercase, lowercase, and number
              </p>
            </div>

            <!-- Phone Field -->
            <div class="form-group">
              <label>Phone Number</label>
              <div class="input-wrapper" [class.error]="submitted && !isValidPhone(phone)">
                <i class="fa-solid fa-phone"></i>
                <input 
                  type="tel" 
                  name="phone" 
                  [(ngModel)]="phone" 
                  placeholder="01123456789"
                  (input)="onFieldChange()"
                >
              </div>
              <p class="field-error" *ngIf="submitted && !isValidPhone(phone)">
                {{ getPhoneErrorMessage() }}
              </p>
            </div>

            <!-- Address Field -->
            <div class="form-group">
              <label>Address</label>
              <div class="input-wrapper" [class.error]="submitted && !isValidAddress(address)">
                <i class="fa-solid fa-location-dot"></i>
                <input 
                  type="text" 
                  name="address" 
                  [(ngModel)]="address" 
                  placeholder="Street, City, Building"
                  (input)="onFieldChange()"
                >
              </div>
              <p class="field-error" *ngIf="submitted && !isValidAddress(address)">
                {{ getAddressErrorMessage() }}
              </p>
            </div>

            <div class="form-options">
              <label class="remember-me">
                <input type="checkbox"> Remember me
              </label>
              <a href="#" class="forgot-password">Forgot password?</a>
            </div>

            <button type="submit" class="auth-btn" [disabled]="isSubmitting">
              <span *ngIf="!isSubmitting">Sign In <i class="fa-solid fa-arrow-right"></i></span>
              <span *ngIf="isSubmitting"><i class="fa-solid fa-spinner fa-spin"></i> Logging in...</span>
            </button>
            
            <p class="field-error center" *ngIf="loginError">{{ loginError }}</p>
          </form>

          <div class="auth-footer">
            <p>Don't have an account? <a routerLink="/register">Create one for free</a></p>
            <a routerLink="/admin-login" class="admin-entry">
              <i class="fa-solid fa-shield-halved"></i>
              Admin login
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      background: var(--bg-main);
      padding: 40px 0;
    }
    .auth-card {
      max-width: 450px;
      margin: 0 auto;
      background: white;
      padding: 50px;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg);
      border: 1px solid var(--border);
    }
    .auth-header {
      text-align: center;
      margin-bottom: 40px;
    }
    .logo {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      font-size: 1.8rem;
      font-weight: 800;
      margin-bottom: 30px;
    }
    .logo img { height: 40px; }
    .logo span span { color: var(--primary); }
    .auth-header h1 { font-size: 2rem; margin-bottom: 10px; }
    .auth-header p { color: var(--text-muted); }
    .form-group { margin-bottom: 25px; }
    .form-group label { display: block; font-weight: 600; margin-bottom: 10px; }
    .input-wrapper { 
      position: relative;
      transition: all 0.3s ease;
    }
    .input-wrapper.error {
      animation: shake 0.3s ease-in-out;
    }
    .input-wrapper.error input {
      border-color: #b91c1c !important;
      background-color: #fff5f5;
    }
    .input-wrapper i { 
      position: absolute; 
      left: 15px; 
      top: 50%; 
      transform: translateY(-50%); 
      color: var(--text-muted);
      z-index: 1;
    }
    .input-wrapper.error i {
      color: #b91c1c;
    }
    .input-wrapper input { 
      width: 100%; 
      padding: 12px 15px 12px 45px; 
      border-radius: var(--radius-md); 
      border: 1px solid var(--border); 
      outline: none; 
      transition: all 0.2s; 
    }
    .input-wrapper input:focus { 
      border-color: var(--secondary); 
      box-shadow: 0 0 0 4px rgba(15, 23, 42, 0.1); 
    }
    .input-wrapper.error input:focus {
      border-color: #b91c1c;
      box-shadow: 0 0 0 4px rgba(185, 28, 28, 0.1);
    }
    .form-options { 
      display: flex; 
      justify-content: space-between; 
      align-items: center; 
      margin-bottom: 30px; 
      font-size: 0.9rem; 
    }
    .remember-me { 
      display: flex; 
      align-items: center; 
      gap: 8px; 
      cursor: pointer; 
    }
    .forgot-password { 
      color: var(--secondary); 
      font-weight: 600; 
    }
    .auth-btn { 
      width: 100%; 
      background: var(--secondary); 
      color: white; 
      padding: 15px; 
      border-radius: var(--radius-md); 
      font-weight: 700; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      gap: 10px; 
      transition: all 0.3s ease;
    }
    .auth-btn:hover:not(:disabled) { 
      background: var(--secondary-light); 
      transform: translateY(-2px); 
    }
    .auth-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    .auth-footer { 
      margin-top: 30px; 
      text-align: center; 
      font-size: 0.95rem; 
      color: var(--text-muted); 
    }
    .auth-footer a { 
      color: var(--secondary); 
      font-weight: 700; 
    }
    .field-error { 
      color: #b91c1c; 
      font-size: 0.85rem; 
      font-weight: 700; 
      margin: 8px 0 0; 
    }
    .field-error.center { 
      text-align: center; 
      margin-top: 14px; 
    }
    .admin-entry {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      margin-top: 14px;
      font-size: 0.9rem;
    }

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }
  `]
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  phone = '';
  address = '';
  loginError = '';
  submitted = false;
  isSubmitting = false;

  // Clear error when user starts typing
  onFieldChange() {
    this.loginError = '';
  }

  onSubmit() {
    this.submitted = true;
    this.loginError = '';
    
    // Check if form is valid
    if (!this.isValidForm()) {
      this.loginError = 'Please fix the highlighted fields.';
      return;
    }

    // Start submitting
    this.isSubmitting = true;

    // Call auth service with all fields
    this.authService.login(this.email, this.password, this.phone, this.address).subscribe(
      (user) => {
        this.authService.setCurrentUser(user);
        this.isSubmitting = false;
        this.router.navigate(['/']);
      },
      (error) => {
        console.error('Login error:', error);
        this.isSubmitting = false;
        this.loginError = 'Login failed. Please check your credentials and try again.';
      }
    );
  }

  // Email validation - must contain @ and .gmail.com or other valid domains
  isValidEmail(value: string): boolean {
    if (!value || value.trim() === '') return false;
    const email = value.trim();
    // Must contain @ and a domain with at least one dot
    // and must end with a valid TLD (com, org, net, etc.)
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  }

  getEmailErrorMessage(): string {
    const email = this.email.trim();
    if (!email) return 'Email is required';
    if (!email.includes('@')) return 'Email must contain @ symbol';
    if (!email.includes('.')) return 'Email must contain a domain (e.g., .com)';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return 'Enter a valid email address (e.g., name@gmail.com)';
    }
    return 'Invalid email format';
  }

  // Password validation - must be at least 8 chars with uppercase, lowercase, and number
  isValidPassword(value: string): boolean {
    if (!value) return false;
    // At least 8 characters, at least one uppercase, one lowercase, and one number
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(value);
  }

  // Phone validation - must be 11 digits starting with 011, 012, 010, or 015
  isValidPhone(value: string): boolean {
    if (!value) return false;
    // Remove any non-digit characters
    const cleanPhone = value.replace(/\D/g, '');
    // Must be exactly 11 digits and start with 011, 012, 010, or 015
    return /^(011|012|010|015)\d{8}$/.test(cleanPhone);
  }

  getPhoneErrorMessage(): string {
    const phone = this.phone.replace(/\D/g, '');
    if (!phone) return 'Phone number is required';
    if (phone.length !== 11) return 'Phone number must be exactly 11 digits';
    if (!/^(011|012|010|015)/.test(phone)) {
      return 'Phone number must start with 011, 012, 010, or 015';
    }
    return 'Invalid phone number format';
  }

  // Address validation - must have 3 parts separated by commas
  isValidAddress(value: string): boolean {
    if (!value) return false;
    const address = value.trim();
    // Must contain exactly 2 commas (3 parts)
    const parts = address.split(',').map(p => p.trim());
    return parts.length === 3 && parts.every(p => p.length > 0);
  }

  getAddressErrorMessage(): string {
    const address = this.address.trim();
    if (!address) return 'Address is required';
    const parts = address.split(',').map(p => p.trim());
    if (parts.length !== 3) {
      return 'Address must contain exactly 3 parts separated by commas (e.g., Street, City, Building)';
    }
    if (parts.some(p => p.length === 0)) {
      return 'Each part of the address must not be empty';
    }
    return 'Invalid address format';
  }

  private isValidForm(): boolean {
    return this.isValidEmail(this.email)
      && this.isValidPassword(this.password)
      && this.isValidPhone(this.phone)
      && this.isValidAddress(this.address);
  }
}