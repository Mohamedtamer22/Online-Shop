import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { FormsModule } from '@angular/forms';
import { Product } from '../../models';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, FormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(30px)' }),
          stagger(100, [
            animate('0.6s cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
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
export class ProductsComponent {
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  categories$ = this.productService.categories$;
  selectedCategory$ = this.productService.selectedCategory$;
  filteredProducts$ = this.productService.filteredProducts$;
  searchQuery: string = '';

  selectedProduct: Product | null = null;

  onCategorySelect(category: string) {
    this.productService.setSelectedCategory(category);
  }

  onSearch() {
    this.productService.setSearchQuery(this.searchQuery);
  }

  resetFilters() {
    this.searchQuery = '';
    this.productService.setSearchQuery('');
    this.productService.setSelectedCategory('All');
  }

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
