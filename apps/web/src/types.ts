export interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: { rate: number; count: number };
}

export interface PagedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CategoryProducts {
  category: string;
  topRated: Product[];
  additional: Product[];
}

export interface ApiError {
  code: string;
  message: string;
}

export interface User {
  id: string;
  email: string;
}
