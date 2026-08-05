import { Injectable } from '@angular/core';
import { User } from '../models';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from './api.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  isLoggedIn$ = this.currentUser$.pipe(map(user => !!user));
  private apiUrl = `${API_BASE_URL}/customers`;

  constructor(private http: HttpClient) {
    const savedUser = localStorage.getItem('eh_user');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  login(email: string, password: string, phone = '', address = ''): Observable<User> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password, phone, address }).pipe(
      map(data => this.toUser(data, email, phone, address))
    );
  }

  register(userData: Partial<User>): Observable<User> {
    return this.http.post<any>(`${this.apiUrl}/add`, userData).pipe(
      map(data => this.toUser(data, userData.email || '', userData.phone || '', userData.address || ''))
    );
  }

  loginLocal(email: string, password: string): boolean {
    // Mock login for demo purposes
    if (email && password) {
      const mockUser: User = {
        id: '1',
        name: 'Demo User',
        email: email,
        phone: '+1 234 567 890',
        address: '123 Tech Avenue, Silicon Valley'
      };
      this.currentUserSubject.next(mockUser);
      localStorage.setItem('eh_user', JSON.stringify(mockUser));
      return true;
    }
    return false;
  }

  registerLocal(userData: Partial<User>): boolean {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: userData.name || 'New User',
      email: userData.email || '',
      phone: userData.phone || '',
      address: userData.address || ''
    };
    this.currentUserSubject.next(newUser);
    localStorage.setItem('eh_user', JSON.stringify(newUser));
    return true;
  }

  setCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
    localStorage.setItem('eh_user', JSON.stringify(user));
  }

  logout() {
    this.currentUserSubject.next(null);
    localStorage.removeItem('eh_user');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private toUser(data: any, email: string, phone: string, address: string): User {
    return {
      id: String(data?.customerId ?? data?.id ?? ''),
      customerId: Number(data?.customerId ?? data?.id ?? 0),
      name: data?.name || email.split('@')[0],
      email: data?.email || email,
      phone: data?.phone || phone,
      address: data?.address || address
    };
  }
}
