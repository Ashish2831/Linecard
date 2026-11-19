import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, '../../..');

dotenv.config({ path: process.env.ENV_FILE });
dotenv.config({ path: path.join(repoRoot, '.env') });
dotenv.config();

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Missing required env: ${name}`);
  }
  return value;
}

export const config = {
  port: Number(process.env.PORT ?? 3001),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  webOrigin: required('WEB_ORIGIN', 'http://localhost:5173'),
  sessionSecret: required('SESSION_SECRET', 'dev-only-session-secret'),
  redisUrl: process.env.REDIS_URL ?? '',
  demoUserEmail: required('DEMO_USER_EMAIL', 'demo@linecard.local'),
  demoUserPassword: required('DEMO_USER_PASSWORD', 'LinecardDemo1!'),
  emailProvider: (process.env.EMAIL_PROVIDER ?? 'console') as 'smtp' | 'console',
  smtpHost: process.env.SMTP_HOST ?? 'localhost',
  smtpPort: Number(process.env.SMTP_PORT ?? 1025),
  smtpFrom: process.env.SMTP_FROM ?? 'noreply@linecard.local',
  salesInbox: process.env.SALES_INBOX ?? 'sales@linecard.local',
  aiProvider: (process.env.AI_PROVIDER ?? 'stub') as 'stub' | 'openai',
  openAiApiKey: process.env.OPENAI_API_KEY ?? '',
  openAiModel: process.env.OPENAI_MODEL ?? 'gpt-4o-mini',
  fakeStoreBaseUrl: process.env.FAKE_STORE_BASE_URL ?? 'https://fakestoreapi.com',
  productCacheTtlSeconds: 300,
  ragIndexTtlSeconds: 900,
};
