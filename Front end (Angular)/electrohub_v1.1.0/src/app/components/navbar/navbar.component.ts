import { Component, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { AdminAuthService } from '../../services/admin-auth.service';
import { FormsModule } from '@angular/forms';
import { map } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private adminAuthService = inject(AdminAuthService);
  
  cartCount$ = this.cartService.cartItems$.pipe(
    map(items => items.reduce((acc, item) => acc + item.quantity, 0))
  );
  
  currentUser$ = this.authService.currentUser$;
  isLoggedIn$ = this.authService.isLoggedIn$;
  isAdminLoggedIn$ = this.adminAuthService.isAdminLoggedIn$;

  isScrolled = false;
  isMobileMenuOpen = false;
  searchQuery = '';
  showUserDropdown = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 20;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (this.isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
    document.body.style.overflow = 'auto';
  }

  toggleUserDropdown() {
    this.showUserDropdown = !this.showUserDropdown;
  }

  logout() {
    this.authService.logout();
    this.showUserDropdown = false;
  }
}
