import type { AssistantAnswer, Product } from '../domain/types.js';

export interface AskContext {
  product?: Product;
  catalogueContext?: Array<{ id: string; title: string; description: string; category: string; price: number }>;
  question: string;
}

export interface IProductAssistant {
  ask(context: AskContext): Promise<AssistantAnswer>;
}
