import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { CartItem, Product } from '../models';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from './api.config';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  private apiUrl = API_BASE_URL;
  
  cartItems$ = this.cartItemsSubject.asObservable();
  
  cartCount$ = this.cartItems$.pipe(
    map(items => items.reduce((count, item) => count + item.quantity, 0))
  );
  
  subtotal$ = this.cartItems$.pipe(
    map(items => items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0))
  );
  
  tax$ = this.subtotal$.pipe(
    map(subtotal => subtotal * 0.1)
  );
  
  total$ = this.subtotal$.pipe(
    map(subtotal => subtotal * 1.1)
  );

  constructor(private http: HttpClient) {
    this.loadCart();
  }

  private saveCart() {
    localStorage.setItem('electrohub_cart', JSON.stringify(this.cartItems));
    this.cartItemsSubject.next([...this.cartItems]);
  }

  private loadCart() {
    const savedCart = localStorage.getItem('electrohub_cart');
    if (savedCart) {
      this.cartItems = JSON.parse(savedCart);
      this.cartItemsSubject.next([...this.cartItems]);
    }
  }

  addToCart(product: Product) {
    const existingItem = this.cartItems.find(item => item.product.id === product.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cartItems.push({ product, quantity: 1 });
    }
    this.saveCart();
  }

  removeFromCart(productId: number) {
    this.cartItems = this.cartItems.filter(item => item.product.id !== productId);
    this.saveCart();
  }

  updateQuantity(productId: number, quantity: number) {
    const item = this.cartItems.find(item => item.product.id === productId);
    if (item) {
      item.quantity = Math.max(1, quantity);
      this.saveCart();
    }
  }

  clearCart() {
    this.cartItems = [];
    this.saveCart();
  }

  checkout(customerId: number): Observable<any> {
    const items = this.cartItems.map(item => ({
      productId: item.product.id,
      quantity: item.quantity
    }));
    return this.http.post<any>(`${this.apiUrl}/products/checkout`, { customerId, items });
  }

  createOrder(customerId: number, totalAmount: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/orders`, {
      customerId,
      totalAmount,
      quantity: this.cartItems.reduce((sum, item) => sum + item.quantity, 0),
      orderDate: new Date()
    });
  }
}
