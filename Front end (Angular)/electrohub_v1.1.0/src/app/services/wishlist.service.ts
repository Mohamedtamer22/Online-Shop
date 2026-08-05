import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models';
import { AuthService } from './auth.service';
import { API_BASE_URL, assetImagePath } from './api.config';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlistItemsSubject = new BehaviorSubject<Product[]>([]);
  private apiUrl = `${API_BASE_URL}/wishlist`;
  wishlist$ = this.wishlistItemsSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {
    const savedWishlist = localStorage.getItem('eh_wishlist');
    if (savedWishlist) {
      this.wishlistItemsSubject.next(JSON.parse(savedWishlist));
    }

    this.authService.currentUser$.subscribe(user => {
      if (user?.customerId) {
        this.loadWishlist(user.customerId);
      }
    });
  }

  loadWishlist(customerId: number): void {
    this.http.get<any[]>(`${this.apiUrl}/customer/${customerId}`).subscribe({
      next: data => this.setWishlist(data.map(item => this.toProduct(item))),
      error: () => this.saveLocal()
    });
  }

  toggleWishlist(product: Product): void {
    const user = this.authService.getCurrentUser();
    const currentItems = this.wishlistItemsSubject.value;
    const exists = currentItems.some(p => p.id === product.id);
    const updatedItems = exists
      ? currentItems.filter(p => p.id !== product.id)
      : [...currentItems, product];

    this.setWishlist(updatedItems);

    if (!user?.customerId) return;

    if (exists) {
      this.http.delete(`${this.apiUrl}/customer/${user.customerId}/product/${product.id}`).subscribe({
        error: () => this.loadWishlist(user.customerId!)
      });
    } else {
      this.http.post<any>(this.apiUrl, { customerId: user.customerId, productId: product.id }).subscribe({
        next: savedProduct => {
          const merged = this.wishlistItemsSubject.value.map(item =>
            item.id === product.id ? this.toProduct(savedProduct) : item
          );
          this.setWishlist(merged);
        },
        error: () => this.loadWishlist(user.customerId!)
      });
    }
  }

  isInWishlist(productId: number): boolean {
    return this.wishlistItemsSubject.value.some(p => p.id === productId);
  }

  private setWishlist(items: Product[]): void {
    this.wishlistItemsSubject.next(items);
    localStorage.setItem('eh_wishlist', JSON.stringify(items));
  }

  private saveLocal(): void {
    localStorage.setItem('eh_wishlist', JSON.stringify(this.wishlistItemsSubject.value));
  }

  private toProduct(data: any): Product {
    return {
      id: Number(data?.id ?? data?.productId ?? 0),
      productId: Number(data?.id ?? data?.productId ?? 0),
      name: data?.name || 'Product',
      category: typeof data?.category === 'string' ? data.category : (data?.category?.name || 'Uncategorized'),
      description: data?.description || '',
      price: Number(data?.price ?? 0),
      rating: Number(data?.rating ?? 0),
      reviews: Number(data?.reviews ?? 0),
      inStock: data?.inStock ?? ((data?.stockQuantity || 0) > 0),
      stockQuantity: Number(data?.stockQuantity ?? 0),
      image: assetImagePath(data?.image)
    };
  }
}
