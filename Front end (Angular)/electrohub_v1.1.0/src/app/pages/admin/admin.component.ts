import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { API_BASE_URL, assetImagePath } from '../../services/api.config';
import { AdminAuthService } from '../../services/admin-auth.service';
import { Product } from '../../models';

interface Category {
  categoryId: number;
  name: string;
  description: string;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <main class="admin-page">
      <section class="admin-hero">
        <div>
          <p class="eyebrow">ElectroHub Control</p>
          <h1>Admin Dashboard</h1>
          <p>Products, orders, and shipping are connected directly to the database.</p>
        </div>
        <div class="hero-actions">
          <button class="refresh-btn" (click)="loadAll()"><i class="fa-solid fa-rotate"></i> Refresh</button>
          <button class="logout-btn" (click)="logoutAdmin()"><i class="fa-solid fa-arrow-right-from-bracket"></i> Logout</button>
        </div>
      </section>

      <section class="stats-grid">
        <div class="stat"><span>{{ products.length }}</span><p>Products</p></div>
        <div class="stat"><span>{{ orders.length }}</span><p>Orders</p></div>
        <div class="stat"><span>{{ shippings.length }}</span><p>Shipping</p></div>
      </section>

      <section class="panel">
        <div class="panel-header">
          <h2>{{ editingId ? 'Edit Product' : 'Add Product' }}</h2>
          <button *ngIf="editingId" class="ghost-btn" (click)="resetForm()">Cancel Edit</button>
        </div>
        <form class="product-form" (ngSubmit)="saveProduct()">
          <input name="name" [(ngModel)]="form.name" placeholder="Product name" required>
          <input name="price" [(ngModel)]="form.price" type="number" placeholder="Price" required>
          <input name="stockQuantity" [(ngModel)]="form.stockQuantity" type="number" placeholder="Stock" required>
          <select name="categoryId" [(ngModel)]="form.categoryId" required>
            <option [ngValue]="null">Choose category</option>
            <option *ngFor="let c of categories" [ngValue]="c.categoryId">{{ c.name }}</option>
          </select>
          <input name="image" [(ngModel)]="form.image" placeholder="Image file e.g. macbookprom3.jpg">
          <textarea name="description" [(ngModel)]="form.description" placeholder="Description"></textarea>
          <button class="primary-btn" type="submit">{{ editingId ? 'Save Product' : 'Add Product' }}</button>
        </form>
      </section>

      <section class="panel">
        <div class="panel-header"><h2>Products</h2></div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th></th></tr></thead>
            <tbody>
              <tr *ngFor="let p of products">
                <td><img class="thumb" [src]="p.image" [alt]="p.name"></td>
                <td>{{ p.name }}</td>
                <td>{{ p.category }}</td>
                <td>{{ p.price | currency }}</td>
                <td>{{ p.stockQuantity }}</td>
                <td class="actions">
                  <button (click)="editProduct(p)">Edit</button>
                  <button class="danger" (click)="deleteProduct(p.id)">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="two-col">
        <div class="panel">
          <div class="panel-header"><h2>Orders</h2></div>
          <div class="mini-list">
            <div class="mini-row" *ngFor="let o of orders">
              <strong>#{{ o.orderId }}</strong>
              <span>{{ o.orderDate }}</span>
              <span>{{ o.totalAmount | currency }}</span>
            </div>
          </div>
        </div>

        <div class="panel">
          <div class="panel-header"><h2>Shipping</h2></div>
          <div class="mini-list">
            <div class="mini-row" *ngFor="let s of shippings">
              <strong>{{ s.trackingNumber }}</strong>
              <span>{{ s.receiverName }}</span>
              <span>{{ s.shippingDate }}</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  `,
  styles: [`
    .admin-page { padding: 36px 5vw 60px; background: var(--bg-main); min-height: 100vh; }
    .admin-hero { display:flex; justify-content:space-between; gap:20px; align-items:center; background:#1f2937; color:#fff; padding:28px; border-radius:18px; margin-bottom:20px; }
    .eyebrow { color:#fecaca; font-weight:800; text-transform:uppercase; font-size:.78rem; letter-spacing:.08em; }
    .admin-hero h1 { font-size:2rem; margin:6px 0; }
    .hero-actions { display:flex; gap:10px; flex-wrap:wrap; justify-content:flex-end; }
    .refresh-btn,.primary-btn,.logout-btn { background:var(--secondary); color:white; border:0; border-radius:10px; padding:12px 16px; font-weight:800; }
    .logout-btn { background:#b91c1c; }
    .stats-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; margin-bottom:18px; }
    .stat,.panel { background:#fff; border:1px solid var(--border); border-radius:16px; box-shadow:var(--shadow-sm); }
    .stat { padding:18px; }
    .stat span { display:block; color:var(--secondary); font-size:1.8rem; font-weight:900; }
    .panel { padding:18px; margin-bottom:18px; }
    .panel-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; }
    .panel h2 { margin:0; font-size:1.2rem; }
    .product-form { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; }
    .product-form input,.product-form select,.product-form textarea { border:1px solid var(--border); border-radius:10px; padding:11px; font:inherit; }
    .product-form textarea { grid-column:span 2; min-height:44px; }
    .ghost-btn,.actions button { border:1px solid var(--border); background:white; border-radius:8px; padding:8px 10px; font-weight:700; }
    .table-wrap { overflow:auto; }
    table { width:100%; border-collapse:collapse; min-width:720px; }
    th,td { text-align:left; padding:10px; border-bottom:1px solid var(--border); }
    .thumb { width:54px; height:42px; object-fit:cover; border-radius:8px; }
    .actions { white-space:nowrap; }
    .actions .danger { color:#b91c1c; margin-left:6px; }
    .two-col { display:grid; grid-template-columns:1fr 1fr; gap:18px; }
    .mini-row { display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px; padding:10px 0; border-bottom:1px solid var(--border); }
    @media(max-width:800px){ .admin-hero,.two-col{grid-template-columns:1fr; display:grid;} .stats-grid,.product-form{grid-template-columns:1fr;} .product-form textarea{grid-column:auto;} }
  `]
})
export class AdminComponent implements OnInit {
  private http = inject(HttpClient);
  private adminAuthService = inject(AdminAuthService);
  private router = inject(Router);

  products: Product[] = [];
  categories: Category[] = [];
  orders: any[] = [];
  shippings: any[] = [];
  editingId: number | null = null;

  form = {
    name: '',
    price: 0,
    stockQuantity: 0,
    categoryId: null as number | null,
    image: '',
    description: ''
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.http.get<any[]>(`${API_BASE_URL}/products`).subscribe(data => {
      this.products = data.map(p => ({
        id: p.id ?? p.productId,
        name: p.name,
        category: typeof p.category === 'string' ? p.category : (p.category?.name || 'Uncategorized'),
        description: p.description || '',
        price: p.price || 0,
        rating: p.rating ?? 0,
        reviews: p.reviews ?? 0,
        inStock: p.inStock ?? ((p.stockQuantity || 0) > 0),
        stockQuantity: p.stockQuantity ?? 0,
        image: assetImagePath(p.image)
      }));
    });
    this.http.get<Category[]>(`${API_BASE_URL}/categories`).subscribe(data => this.categories = data);
    this.http.get<any[]>(`${API_BASE_URL}/orders`).subscribe(data => this.orders = data);
    this.http.get<any[]>(`${API_BASE_URL}/shipping`).subscribe(data => this.shippings = data);
  }

  saveProduct(): void {
    const body = {
      name: this.form.name,
      price: Number(this.form.price),
      stockQuantity: Number(this.form.stockQuantity),
      image: this.form.image,
      description: this.form.description,
      category: this.form.categoryId ? { categoryId: this.form.categoryId } : null
    };
    const request = this.editingId
      ? this.http.put(`${API_BASE_URL}/products/${this.editingId}`, body)
      : this.http.post(`${API_BASE_URL}/products/add`, body);

    request.subscribe(() => {
      this.resetForm();
      this.loadAll();
    });
  }

  editProduct(product: Product): void {
    const category = this.categories.find(c => c.name === product.category);
    this.editingId = product.id;
    this.form = {
      name: product.name,
      price: product.price,
      stockQuantity: product.stockQuantity ?? 0,
      categoryId: category?.categoryId ?? null,
      image: product.image.replace('assets/images/', ''),
      description: product.description
    };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteProduct(id: number): void {
    if (!confirm('Delete this product?')) return;
    this.http.delete(`${API_BASE_URL}/products/${id}`).subscribe(() => this.loadAll());
  }

  logoutAdmin(): void {
    this.adminAuthService.logout();
    this.router.navigate(['/admin-login']);
  }

  resetForm(): void {
    this.editingId = null;
    this.form = { name: '', price: 0, stockQuantity: 0, categoryId: null, image: '', description: '' };
  }
}
