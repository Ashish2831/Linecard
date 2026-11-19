import cors from 'cors';
import express from 'express';
import session from 'express-session';
import helmet from 'helmet';
import { RedisStore } from 'connect-redis';
import { config } from './config.js';
import type { AppDependencies } from './factories/createDependencies.js';
import { getRedis, redisPing, usingMemoryRedis } from './lib/redis.js';
import { createAuthRouter } from './routes/auth.js';
import { createCatalogueRouter } from './routes/catalogue.js';
import { createCategoriesRouter } from './routes/categories.js';
import { createEnquiriesRouter } from './routes/enquiries.js';
import { createProductsRouter } from './routes/products.js';
import { AuthService } from './services/AuthService.js';
import { CatalogueRagService } from './services/CatalogueRagService.js';
import { EnquiryService } from './services/EnquiryService.js';
import { ProductAssistantService } from './services/ProductAssistantService.js';
import { ProductService } from './services/ProductService.js';
import { ok } from './lib/responses.js';

export async function createApp(deps: AppDependencies) {
  const app = express();

  app.set('trust proxy', 1);
  app.use(helmet());
  app.use(
    cors({
      origin: config.webOrigin,
      credentials: true,
    }),
  );
  app.use(express.json({ limit: '100kb' }));

  const redis = await getRedis();
  const sessionOptions: session.SessionOptions = {
    name: 'linecard.sid',
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: config.nodeEnv === 'production',
      maxAge: 1000 * 60 * 60 * 8,
    },
  };

  if (redis && !usingMemoryRedis()) {
    sessionOptions.store = new RedisStore({ client: redis, prefix: 'sess:' });
  }

  app.use(session(sessionOptions));

  const productService = new ProductService(deps.productRepository);
  const enquiryService = new EnquiryService(deps.productRepository);
  const authService = new AuthService(deps.userRepository);
  const assistantService = new ProductAssistantService(
    deps.productRepository,
    deps.assistant,
  );
  const ragService = new CatalogueRagService(
    deps.productRepository,
    deps.embeddings,
    deps.ragIndexer,
    deps.assistant,
  );

  app.get('/api/health', async (_req, res) => {
    const redisOk = await redisPing();
    ok(res, { status: 'ok', redis: redisOk, aiProvider: config.aiProvider });
  });

  app.use('/api/auth', createAuthRouter(authService));
  app.use('/api/products', createProductsRouter(productService, assistantService));
  app.use('/api/categories', createCategoriesRouter(productService));
  app.use('/api/enquiries', createEnquiriesRouter(enquiryService));
  app.use('/api/catalogue', createCatalogueRouter(ragService));

  return app;
}
