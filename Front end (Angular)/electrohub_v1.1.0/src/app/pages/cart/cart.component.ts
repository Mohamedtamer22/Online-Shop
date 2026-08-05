import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { FormsModule } from '@angular/forms';
import { take } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(50, [
            animate('0.4s cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class CartComponent {
  private cartService = inject(CartService);
  private orderService = inject(OrderService);
  private authService = inject(AuthService);
  private router = inject(Router);

  cartItems$ = this.cartService.cartItems$;
  cart$ = this.cartItems$; // Alias for template compatibility
  subtotal$ = this.cartService.subtotal$;
  tax$ = this.cartService.tax$;
  total$ = this.cartService.total$;
  isLoggedIn$ = this.authService.isLoggedIn$;
  
  showSuccess = false;
  lastOrderId = '';
  checkoutError = '';

  updateQuantity(productId: number, quantity: number) {
    this.cartService.updateQuantity(productId, quantity);
  }

  removeItem(productId: number) {
    this.cartService.removeFromCart(productId);
  }

  checkout() {
    this.isLoggedIn$.pipe(take(1)).subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.processOrder();
      } else {
        this.router.navigate(['/login'], { queryParams: { returnUrl: '/cart' } });
      }
    });
  }

  private processOrder() {
    let items: any[] = [];
    let subtotal = 0, tax = 0, total = 0;
    const user = this.authService.getCurrentUser();
    
    this.cartItems$.pipe(take(1)).subscribe(i => items = i);
    this.subtotal$.pipe(take(1)).subscribe(s => subtotal = s);
    this.tax$.pipe(take(1)).subscribe(t => tax = t);
    this.total$.pipe(take(1)).subscribe(t => total = t);

    if (items.length > 0 && user?.customerId) {
      this.checkoutError = '';
      this.cartService.checkout(user.customerId).subscribe({
        next: () => {
          const order = this.orderService.createOrder(items, subtotal, tax, total, user.address || 'Default Address', 'Credit Card');
          this.lastOrderId = order.id;
          this.showSuccess = true;
          this.cartService.clearCart();
        },
        error: (error) => {
          console.error('Checkout error:', error);
          this.checkoutError = 'Could not place the order. Please check stock and try again.';
        }
      });
    } else {
      this.checkoutError = 'Please sign in before checkout.';
    }
  }

  closeSuccess() {
    this.showSuccess = false;
  }
}
