import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { loggerToWinstonLogger } from '@backstage/backend-common';
import { createExploreRouter } from '../router/createExploreRouter';

export const explorebackendPlugin = createBackendPlugin({
  pluginId: 'explore',
  register(env) {
    env.registerInit({
      deps: {
        http: coreServices.httpRouter,
        logger: coreServices.logger,
      },
      async init({ http, logger }) {
        const winstonLogger = loggerToWinstonLogger(logger);
        http.use(await createExploreRouter(winstonLogger));
      },
    });
  },
});
