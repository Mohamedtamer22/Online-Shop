import { Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable } from "rxjs";
import { Product } from "../models";
import { HttpClient } from "@angular/common/http";
import { API_BASE_URL, assetImagePath } from "./api.config";

@Injectable({
  providedIn: "root",
})
export class ProductService {
  private apiUrl = `${API_BASE_URL}/products`;
  private products: Product[] = [];
  private categories = [
    "Phones",
    "Laptops",
    "Tablets",
    "Headphones",
    "Wearables",
    "Gaming",
    "Monitors",
    "Cameras",
    "Storage",
    "Accessories",
    "Peripherals"
  ];

  private productsSubject = new BehaviorSubject<Product[]>([]);
  private categoriesSubject = new BehaviorSubject<string[]>(this.categories);
  private selectedCategorySubject = new BehaviorSubject<string>("All");
  private searchQuerySubject = new BehaviorSubject<string>("");

  products$ = this.productsSubject.asObservable();
  categories$ = this.categoriesSubject.asObservable();
  selectedCategory$ = this.selectedCategorySubject.asObservable();
  searchQuery$ = this.searchQuerySubject.asObservable();
  filteredProducts$: Observable<Product[]>;

  constructor(private http: HttpClient) {
    this.filteredProducts$ = this.updateFilteredProducts();
    this.loadProducts();
  }

  loadProducts(): void {
    this.http.get<any[]>(this.apiUrl).subscribe(
      (data) => {
        this.products = data.map(p => ({
          id: p.id ?? p.productId,
          productId: p.id ?? p.productId,
          name: p.name,
          category: typeof p.category === 'string' ? p.category : (p.category?.name || 'Uncategorized'),
          description: p.description || '',
          price: p.price || 0,
          rating: p.rating ?? 4.5,
          reviews: p.reviews ?? 0,
          stockQuantity: p.stockQuantity ?? 0,
          inStock: p.inStock ?? ((p.stockQuantity || 0) > 0),
          image: assetImagePath(p.image)
        }));
        this.productsSubject.next(this.products);
        this.refreshFilteredProducts();
      },
      (error) => {
        console.error('Error loading products:', error);
      }
    );

    this.http.get<string[]>(`${this.apiUrl}/categories`).subscribe({
      next: (categories) => this.categoriesSubject.next(categories.filter(c => c !== 'All')),
      error: (error) => console.error('Error loading categories:', error)
    });
  }

  private updateFilteredProducts(): Observable<Product[]> {
    return this.productsSubject.pipe(
      map((products) => {
        const category = this.selectedCategorySubject.value;
        const query = this.searchQuerySubject.value.toLowerCase();
        return products.filter((p) => {
          const matchesCategory = category === "All" || p.category === category;
          const matchesSearch =
            p.name.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query);
          return matchesCategory && matchesSearch;
        });
      }),
    );
  }

  getProducts(): Product[] {
    return this.products;
  }

  getFeaturedProducts(): Product[] {
    return this.products.slice(0, 6);
  }

  setSelectedCategory(category: string) {
    this.selectedCategorySubject.next(category);
    this.refreshFilteredProducts();
  }

  setSearchQuery(query: string) {
    this.searchQuerySubject.next(query);
    this.refreshFilteredProducts();
  }

  private refreshFilteredProducts() {
    // This is to trigger the filteredProducts$ observable
    this.productsSubject.next([...this.products]);
  }

  getProductById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  reserveProduct(id: number, quantity: number = 1): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/reserve?quantity=${quantity}`, {});
  }

  checkout(customerId: number, items: any[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/checkout`, { customerId, items });
  }
}
