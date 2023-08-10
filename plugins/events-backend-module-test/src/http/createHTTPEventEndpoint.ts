import { HttpPostIngressOptions } from '@backstage/plugin-events-node';
import { Logger } from 'winston';

export function createHTTPEventEndpoint(
  logger: Logger,
): HttpPostIngressOptions {
  return {
    topic: 'test-dynamic-plugins',
    validator: async (): Promise<void> => {
      logger.info(`Dynamic Plugins Test: Validating http event`);
    },
  };
}
