import { Component, Input, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
  animations: [
    trigger('slideUp', [
      transition(':enter', [
        style({ transform: 'translateY(30px)', opacity: 0 }),
        animate('0.6s cubic-bezier(0.4, 0, 0.2, 1)', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ])
  ]
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Output() quickView = new EventEmitter<Product>();
  
  private cartService = inject(CartService);
  private wishlistService = inject(WishlistService);

  addToCart() {
    this.cartService.addToCart(this.product);
  }

  toggleWishlist(event: Event) {
    event.stopPropagation();
    this.wishlistService.toggleWishlist(this.product);
  }

  isInWishlist(): boolean {
    return this.wishlistService.isInWishlist(this.product.id);
  }

  onQuickView(event: Event) {
    event.stopPropagation();
    this.quickView.emit(this.product);
  }
}
