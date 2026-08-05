import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Order, CartItem } from '../models';
import { API_BASE_URL } from './api.config';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private orders: Order[] = [];
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  private apiUrl = `${API_BASE_URL}/orders`;
  
  orders$ = this.ordersSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadOrders();
  }

  private saveOrders() {
    localStorage.setItem('electrohub_orders', JSON.stringify(this.orders));
    this.ordersSubject.next([...this.orders]);
  }

  private loadOrders() {
    const savedOrders = localStorage.getItem('electrohub_orders');
    if (savedOrders) {
      this.orders = JSON.parse(savedOrders);
      this.ordersSubject.next([...this.orders]);
    }
  }

  createOrder(items: CartItem[], subtotal: number, tax: number, total: number, shippingAddress: string, paymentMethod: string): Order {
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      items: [...items],
      subtotal,
      tax,
      total,
      shippingAddress,
      paymentMethod,
      status: 'pending',
      createdAt: new Date()
    };
    
    this.orders.unshift(newOrder);
    this.saveOrders();
    return newOrder;
  }

  getOrders(): Order[] {
    return this.orders;
  }

  getOrderById(id: string): Order | undefined {
    return this.orders.find(o => o.id === id);
  }

  getCustomerOrders(customerId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/customer/${customerId}`);
  }
}
