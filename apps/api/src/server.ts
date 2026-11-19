import { createApp } from './app.js';
import { config } from './config.js';
import { createDependencies } from './factories/createDependencies.js';
import { logger } from './lib/logger.js';

async function main() {
  const deps = await createDependencies();
  const app = await createApp(deps);
  app.listen(config.port, () => {
    logger.info('Linecard API listening', { port: config.port });
  });
}

main().catch((error) => {
  logger.error('Failed to start API', {
    message: error instanceof Error ? error.message : 'unknown',
  });
  process.exit(1);
});
