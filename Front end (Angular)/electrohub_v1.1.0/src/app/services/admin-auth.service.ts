import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { API_BASE_URL } from './api.config';

export interface AdminUser {
  adminId: number;
  username: string;
  name: string;
  email?: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminAuthService {
  private currentAdminSubject = new BehaviorSubject<AdminUser | null>(null);
  currentAdmin$ = this.currentAdminSubject.asObservable();
  isAdminLoggedIn$ = this.currentAdmin$.pipe(map(admin => !!admin));
  private apiUrl = `${API_BASE_URL}/admins`;

  constructor(private http: HttpClient) {
    const savedAdmin = localStorage.getItem('eh_admin');
    if (savedAdmin) {
      this.currentAdminSubject.next(JSON.parse(savedAdmin));
    }
  }

  login(username: string, password: string): Observable<AdminUser> {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password }).pipe(
      map(data => this.toAdmin(data, username))
    );
  }

  setCurrentAdmin(admin: AdminUser): void {
    this.currentAdminSubject.next(admin);
    localStorage.setItem('eh_admin', JSON.stringify(admin));
  }

  logout(): void {
    this.currentAdminSubject.next(null);
    localStorage.removeItem('eh_admin');
  }

  getCurrentAdmin(): AdminUser | null {
    return this.currentAdminSubject.value;
  }

  private toAdmin(data: any, username: string): AdminUser {
    return {
      adminId: Number(data?.adminId ?? 0),
      username: data?.username || username,
      name: data?.name || 'ElectroHub Admin',
      email: data?.email || '',
      role: data?.role || 'ADMIN'
    };
  }
}
