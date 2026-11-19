export interface ProductRating {
  rate: number;
  count: number;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: ProductRating;
}

export interface ProductQuery {
  category?: string;
  q?: string;
  page?: number;
  pageSize?: number;
  sort?: 'rating' | 'title';
}

export interface PagedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface User {
  id: string;
  email: string;
  passwordHash: string;
}

export interface EnquiryInput {
  productId: string;
  name: string;
  email: string;
  message: string;
  phone?: string;
}

export interface AssistantAnswer {
  answer: string;
  provider: 'stub' | 'openai';
}

export interface RagCitation {
  productId: string;
  title: string;
}

export interface RagAnswer extends AssistantAnswer {
  citations: RagCitation[];
}
