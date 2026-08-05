import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { trigger, transition, style, animate } from '@angular/animations';
import { Product } from '../../models';
import { CartService } from '../../services/cart.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.6s cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1 }))
      ])
    ]),
    trigger('scaleIn', [
      transition(':enter', [
        style({ transform: 'scale(0.9)', opacity: 0 }),
        animate('0.6s cubic-bezier(0.4, 0, 0.2, 1)', style({ transform: 'scale(1)', opacity: 1 }))
      ])
    ]),
    trigger('modalAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('0.2s ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('0.15s ease-in', style({ opacity: 0, transform: 'scale(0.95)' }))
      ])
    ])
  ]
})
export class HomeComponent {
  private productService = inject(ProductService);
  private authService = inject(AuthService);
  private cartService = inject(CartService);

  currentUser$ = this.authService.currentUser$;
  featuredProducts$ = this.productService.products$.pipe(map(products => products.slice(0, 6)));
  selectedProduct: Product | null = null;

  openQuickView(product: Product) {
    this.selectedProduct = product;
    document.body.style.overflow = 'hidden';
  }

  closeQuickView() {
    this.selectedProduct = null;
    document.body.style.overflow = 'auto';
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
    this.closeQuickView();
  }
}
