import { DemoUserRepository } from '../auth/DemoUserRepository.js';
import { OpenAIProductAssistant } from '../assistant/OpenAIProductAssistant.js';
import { StubProductAssistant } from '../assistant/StubProductAssistant.js';
import type { IProductAssistant } from '../assistant/IProductAssistant.js';
import { config } from '../config.js';
import { ConsoleEmailSender } from '../email/ConsoleEmailSender.js';
import type { IEmailSender } from '../email/IEmailSender.js';
import { SmtpEmailSender } from '../email/SmtpEmailSender.js';
import { FakeStoreProductRepository } from '../repositories/FakeStoreProductRepository.js';
import type { IProductRepository } from '../repositories/IProductRepository.js';
import { RedisCachingProductRepository } from '../repositories/RedisCachingProductRepository.js';
import { OpenAIEmbeddingProvider } from '../rag/OpenAIEmbeddingProvider.js';
import { StubEmbeddingProvider } from '../rag/StubEmbeddingProvider.js';
import type { IEmbeddingProvider } from '../rag/IEmbeddingProvider.js';
import { CatalogueRagIndexer } from '../rag/CatalogueRagIndexer.js';
import { registerEnquiryListener } from '../events/registerEnquiryListener.js';

export interface AppDependencies {
  productRepository: IProductRepository;
  emailSender: IEmailSender;
  assistant: IProductAssistant;
  embeddings: IEmbeddingProvider;
  ragIndexer: CatalogueRagIndexer;
  userRepository: DemoUserRepository;
}

export async function createDependencies(): Promise<AppDependencies> {
  const inner = new FakeStoreProductRepository(
    config.fakeStoreBaseUrl,
    config.productCacheTtlSeconds,
  );
  const productRepository = new RedisCachingProductRepository(
    inner,
    config.productCacheTtlSeconds,
  );

  const emailSender: IEmailSender =
    config.emailProvider === 'smtp'
      ? new SmtpEmailSender(config.smtpHost, config.smtpPort)
      : new ConsoleEmailSender();

  const useOpenAi = config.aiProvider === 'openai' && Boolean(config.openAiApiKey);

  const assistant: IProductAssistant = useOpenAi
    ? new OpenAIProductAssistant(config.openAiApiKey, config.openAiModel)
    : new StubProductAssistant();

  const embeddings: IEmbeddingProvider = useOpenAi
    ? new OpenAIEmbeddingProvider(config.openAiApiKey)
    : new StubEmbeddingProvider();

  const ragIndexer = new CatalogueRagIndexer(embeddings, config.ragIndexTtlSeconds);

  const userRepository = new DemoUserRepository(
    config.demoUserEmail,
    config.demoUserPassword,
  );
  await userRepository.init();

  registerEnquiryListener(emailSender);

  return {
    productRepository,
    emailSender,
    assistant,
    embeddings,
    ragIndexer,
    userRepository,
  };
}
