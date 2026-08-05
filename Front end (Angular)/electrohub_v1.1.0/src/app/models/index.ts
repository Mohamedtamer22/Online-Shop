export interface Product {
  id: number;
  productId?: number;
  name: string;
  category: string;
  description: string;
  price: number;
  rating: number;
  reviews: number;
  inStock: boolean;
  image: string;
  stockQuantity?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  shippingAddress: string;
  paymentMethod: string;
  status: 'pending' | 'shipped' | 'delivered';
  createdAt: Date;
}

export interface User {
  id: string;
  customerId?: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  password?: string;
}
