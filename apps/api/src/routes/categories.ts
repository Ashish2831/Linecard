import { Router } from 'express';
import { ok, fail } from '../lib/responses.js';
import type { ProductService } from '../services/ProductService.js';

export function createCategoriesRouter(productService: ProductService) {
  const router = Router();

  router.get('/', async (_req, res) => {
    try {
      ok(res, await productService.listCategories());
    } catch (error) {
      fail(res, error);
    }
  });

  router.get('/:category', async (req, res) => {
    try {
      ok(res, await productService.getCategoryProducts(req.params.category));
    } catch (error) {
      fail(res, error);
    }
  });

  return router;
}
