import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { WishlistService } from '../../services/wishlist.service';
import { Product, User } from '../../models';
import { API_BASE_URL, assetImagePath } from '../../services/api.config';

type ProfileTab = 'info' | 'orders' | 'wishlist';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="profile-page animate-fade-in">
      <div class="container">
        <div class="profile-grid">
          <aside class="profile-sidebar">
            <div class="user-info-card">
              <div class="avatar-wrapper">
                <div class="avatar-placeholder">{{ getInitials(user?.name) }}</div>
              </div>
              <h3>{{ user?.name }}</h3>
              <p>{{ user?.email }}</p>
            </div>

            <nav class="profile-nav">
              <button class="nav-item" [class.active]="activeTab === 'info'" (click)="setTab('info')">
                <i class="fa-regular fa-user"></i> Personal Info
              </button>
              <button class="nav-item" [class.active]="activeTab === 'orders'" (click)="setTab('orders')">
                <i class="fa-solid fa-box"></i> My Orders
              </button>
              <button class="nav-item" [class.active]="activeTab === 'wishlist'" (click)="setTab('wishlist')">
                <i class="fa-regular fa-heart"></i> Wishlist
              </button>
              <div class="nav-divider"></div>
              <button class="nav-item logout-item" (click)="logout()">
                <i class="fa-solid fa-arrow-right-from-bracket"></i> Logout
              </button>
            </nav>
          </aside>

          <main class="profile-content">
            <section class="content-card" *ngIf="activeTab === 'info'">
              <div class="card-header">
                <h2>Personal Information</h2>
                <p>Update your name and phone number.</p>
              </div>

              <form (ngSubmit)="updateProfile()" class="profile-form">
                <div class="form-row">
                  <div class="form-group">
                    <label>Full Name</label>
                    <div class="input-wrapper">
                      <i class="fa-regular fa-user"></i>
                      <input type="text" [(ngModel)]="editUser.name" name="name" placeholder="Your Name">
                    </div>
                  </div>
                  <div class="form-group">
                    <label>Email Address</label>
                    <div class="input-wrapper">
                      <i class="fa-regular fa-envelope"></i>
                      <input type="email" [(ngModel)]="editUser.email" name="email" disabled>
                    </div>
                  </div>
                </div>

                <div class="form-row one">
                  <div class="form-group">
                    <label>Phone Number</label>
                    <div class="input-wrapper">
                      <i class="fa-solid fa-phone"></i>
                      <input type="tel" [(ngModel)]="editUser.phone" name="phone" placeholder="+20 100 000 0000">
                    </div>
                  </div>
                </div>

                <div class="form-actions">
                  <button type="button" class="btn-secondary" (click)="resetForm()">Cancel</button>
                  <button type="submit" class="btn-primary">Save Changes</button>
                </div>
              </form>

              <div class="success-message" *ngIf="showSuccess">
                <i class="fa-solid fa-circle-check"></i>
                Profile updated successfully!
              </div>
              <div class="error-message" *ngIf="profileError">
                <i class="fa-solid fa-circle-exclamation"></i>
                {{ profileError }}
              </div>
            </section>

            <section class="content-card" *ngIf="activeTab === 'orders'">
              <div class="card-header row-header">
                <div>
                  <h2>My Orders</h2>
                  <p>Orders placed from your cart are loaded from the database.</p>
                </div>
                <button class="btn-secondary compact" (click)="loadOrders()">
                  <i class="fa-solid fa-rotate"></i> Refresh
                </button>
              </div>

              <div class="empty-state" *ngIf="!isLoadingOrders && orders.length === 0">
                <i class="fa-solid fa-box-open"></i>
                <h3>No orders yet</h3>
                <p>Your completed checkout orders will appear here.</p>
              </div>

              <div class="loading-state" *ngIf="isLoadingOrders">Loading orders...</div>
              <div class="error-message" *ngIf="ordersError">{{ ordersError }}</div>

              <div class="orders-list" *ngIf="orders.length > 0">
                <article class="order-card" *ngFor="let order of orders">
                  <div class="order-head">
                    <div>
                      <strong>Order #{{ order.orderId }}</strong>
                      <span>{{ order.orderDate | date:'mediumDate' }}</span>
                    </div>
                    <div class="order-total">{{ order.totalAmount | currency }}</div>
                  </div>
                  <div class="order-meta">
                    <span>{{ order.quantity || getOrderItems(order).length }} item(s)</span>
                    <span>Processing</span>
                  </div>
                  <div class="order-items" *ngIf="getOrderItems(order).length">
                    <div class="order-item" *ngFor="let item of getOrderItems(order)">
                      <img [src]="imageFor(item.product?.image)" [alt]="item.product?.name || 'Product'">
                      <div>
                        <strong>{{ item.product?.name || 'Product' }}</strong>
                        <span>Qty {{ item.quantity }} - {{ item.price | currency }}</span>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            </section>

            <section class="content-card" *ngIf="activeTab === 'wishlist'">
              <div class="card-header">
                <h2>Wishlist</h2>
                <p>Products you saved from the shop.</p>
              </div>

              <ng-container *ngIf="wishlist$ | async as wishlist">
                <div class="empty-state" *ngIf="wishlist.length === 0">
                  <i class="fa-regular fa-heart"></i>
                  <h3>No wishlist items</h3>
                  <p>Tap the heart on any product to save it here.</p>
                </div>

                <div class="wishlist-grid" *ngIf="wishlist.length > 0">
                  <article class="wishlist-card" *ngFor="let product of wishlist">
                    <img [src]="product.image" [alt]="product.name">
                    <div class="wishlist-info">
                      <span>{{ product.category }}</span>
                      <h3>{{ product.name }}</h3>
                      <strong>{{ product.price | currency }}</strong>
                    </div>
                    <div class="wishlist-actions">
                      <button class="btn-secondary compact" (click)="removeFromWishlist(product)">
                        <i class="fa-solid fa-trash-can"></i>
                      </button>
                      <button class="btn-primary compact" (click)="addToCart(product)">
                        <i class="fa-solid fa-cart-plus"></i> Add
                      </button>
                    </div>
                  </article>
                </div>
              </ng-container>
            </section>
          </main>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-page {
      padding: 60px 0;
      background: var(--bg-main);
      min-height: calc(100vh - 80px);
    }
    .profile-grid {
      display: grid;
      grid-template-columns: 300px 1fr;
      gap: 30px;
    }
    @media (max-width: 992px) {
      .profile-grid { grid-template-columns: 1fr; }
    }
    .user-info-card {
      background: white;
      padding: 30px;
      border-radius: var(--radius-lg);
      text-align: center;
      box-shadow: var(--shadow-md);
      margin-bottom: 20px;
      border: 1px solid var(--border);
    }
    .avatar-wrapper {
      width: 100px;
      height: 100px;
      margin: 0 auto 20px;
    }
    .avatar-placeholder {
      width: 100%;
      height: 100%;
      background: var(--secondary);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      font-weight: 700;
    }
    .user-info-card h3 { margin-bottom: 5px; }
    .user-info-card p { color: var(--text-muted); font-size: 0.9rem; }
    .profile-nav {
      background: white;
      padding: 15px;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-md);
      border: 1px solid var(--border);
    }
    .nav-item {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 15px;
      border-radius: var(--radius-md);
      background: transparent;
      color: var(--text-main);
      font-weight: 600;
      transition: all 0.2s;
      margin-bottom: 5px;
      text-align: left;
    }
    .nav-item i { width: 20px; font-size: 1.1rem; color: var(--text-muted); }
    .nav-item:hover { background: var(--bg-main); }
    .nav-item.active { background: var(--secondary); color: white; }
    .nav-item.active i { color: white; }
    .nav-divider { height: 1px; background: var(--border); margin: 10px 0; }
    .logout-item { color: var(--error); }
    .logout-item i { color: var(--error); }
    .logout-item:hover { background: #fef2f2; }
    .content-card {
      background: white;
      padding: 40px;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-md);
      border: 1px solid var(--border);
    }
    .card-header { margin-bottom: 35px; }
    .card-header h2 { font-size: 1.8rem; margin-bottom: 8px; }
    .card-header p { color: var(--text-muted); }
    .row-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
    }
    .profile-form { display: flex; flex-direction: column; gap: 25px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .form-row.one { grid-template-columns: minmax(220px, 1fr) 1fr; }
    @media (max-width: 576px) {
      .form-row, .form-row.one { grid-template-columns: 1fr; }
      .content-card { padding: 24px; }
    }
    .form-group label { display: block; font-weight: 600; margin-bottom: 10px; font-size: 0.95rem; }
    .input-wrapper { position: relative; }
    .input-wrapper i { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: var(--text-muted); }
    .input-wrapper input {
      width: 100%;
      padding: 12px 15px 12px 45px;
      border-radius: var(--radius-md);
      border: 1px solid var(--border);
      outline: none;
      transition: all 0.2s;
      font-size: 1rem;
    }
    .input-wrapper input:focus { border-color: var(--secondary); box-shadow: 0 0 0 4px rgba(15, 23, 42, 0.1); }
    .input-wrapper input:disabled { background: var(--bg-main); cursor: not-allowed; }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 15px;
      margin-top: 20px;
      padding-top: 30px;
      border-top: 1px solid var(--border);
    }
    .compact {
      min-height: 40px;
      padding: 9px 13px;
      border-radius: 10px;
      font-weight: 800;
    }
    .success-message, .error-message {
      margin-top: 20px;
      padding: 15px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 600;
    }
    .success-message { background: #ecfdf5; color: var(--success); }
    .error-message { background: #fef2f2; color: var(--error); }
    .loading-state, .empty-state {
      border: 1px dashed var(--border);
      border-radius: var(--radius-lg);
      padding: 34px;
      text-align: center;
      color: var(--text-muted);
    }
    .empty-state i { font-size: 2rem; color: var(--secondary); margin-bottom: 12px; }
    .empty-state h3 { color: var(--text-main); margin-bottom: 8px; }
    .orders-list { display: grid; gap: 14px; }
    .order-card {
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 18px;
      background: #fff;
    }
    .order-head, .order-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    .order-head strong { display: block; font-size: 1.05rem; }
    .order-head span, .order-meta { color: var(--text-muted); font-size: .9rem; }
    .order-total { color: var(--secondary); font-weight: 900; font-size: 1.15rem; }
    .order-meta { margin-top: 10px; }
    .order-items { display: grid; gap: 10px; margin-top: 14px; padding-top: 14px; border-top: 1px solid var(--border); }
    .order-item { display: flex; align-items: center; gap: 12px; }
    .order-item img {
      width: 58px;
      height: 46px;
      object-fit: cover;
      border-radius: 10px;
      border: 1px solid var(--border);
    }
    .order-item span { display: block; color: var(--text-muted); font-size: .9rem; margin-top: 3px; }
    .wishlist-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
      gap: 16px;
    }
    .wishlist-card {
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      overflow: hidden;
      background: #fff;
    }
    .wishlist-card img {
      width: 100%;
      aspect-ratio: 4 / 3;
      object-fit: cover;
      background: var(--bg-main);
    }
    .wishlist-info { padding: 14px; }
    .wishlist-info span {
      color: var(--primary);
      font-size: .78rem;
      font-weight: 900;
      text-transform: uppercase;
    }
    .wishlist-info h3 { margin: 6px 0 10px; font-size: 1rem; }
    .wishlist-actions {
      display: flex;
      gap: 8px;
      padding: 0 14px 14px;
    }
    .wishlist-actions .btn-secondary { width: 46px; }
    .wishlist-actions .btn-primary { flex: 1; }
  `]
})
export class ProfileComponent implements OnInit {
  private authService = inject(AuthService);
  private orderService = inject(OrderService);
  private wishlistService = inject(WishlistService);
  private cartService = inject(CartService);
  private http = inject(HttpClient);

  user: User | null = null;
  editUser: Partial<User> = {};
  activeTab: ProfileTab = 'info';
  wishlist$ = this.wishlistService.wishlist$;
  orders: any[] = [];
  isLoadingOrders = false;
  ordersError = '';
  profileError = '';
  showSuccess = false;

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
      if (user) {
        this.editUser = { ...user };
        this.loadOrders();
      }
    });
  }

  setTab(tab: ProfileTab): void {
    this.activeTab = tab;
    if (tab === 'orders') {
      this.loadOrders();
    }
  }

  loadOrders(): void {
    if (!this.user?.customerId) return;
    this.isLoadingOrders = true;
    this.ordersError = '';
    this.orderService.getCustomerOrders(this.user.customerId).subscribe({
      next: orders => {
        this.orders = orders;
        this.isLoadingOrders = false;
      },
      error: () => {
        this.ordersError = 'Could not load your orders. Please try again.';
        this.isLoadingOrders = false;
      }
    });
  }

  getInitials(name: string | undefined): string {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }

  updateProfile(): void {
    if (!this.user?.customerId) return;
    this.profileError = '';
    this.http.put<any>(`${API_BASE_URL}/customers/${this.user.customerId}`, {
      name: this.editUser.name,
      email: this.user.email,
      phone: this.editUser.phone
    }).subscribe({
      next: data => {
        const updatedUser: User = {
          ...this.user!,
          name: data?.name || this.editUser.name || this.user!.name,
          phone: data?.phone || this.editUser.phone || this.user!.phone
        };
        this.authService.setCurrentUser(updatedUser);
        this.showSuccess = true;
        setTimeout(() => this.showSuccess = false, 3000);
      },
      error: () => {
        this.profileError = 'Could not update your profile. Please try again.';
      }
    });
  }

  resetForm(): void {
    if (this.user) {
      this.editUser = { ...this.user };
    }
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }

  removeFromWishlist(product: Product): void {
    this.wishlistService.toggleWishlist(product);
  }

  getOrderItems(order: any): any[] {
    return order?.orderItems || [];
  }

  imageFor(value: string | undefined): string {
    return assetImagePath(value);
  }

  logout(): void {
    this.authService.logout();
  }
}
