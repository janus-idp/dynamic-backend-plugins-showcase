import {
  coreServices,
  createBackendModule,
} from '@backstage/backend-plugin-api';
import { eventsExtensionPoint } from '@backstage/plugin-events-node/alpha';
import { loggerToWinstonLogger } from '@backstage/backend-common';
import { createHTTPEventEndpoint } from '../http/createHTTPEventEndpoint';

/**
 * Module for the events-backend plugin, exposing an additional event route
 *
 * @alpha
 */
export const eventsModuleWebhook = createBackendModule({
  pluginId: 'events',
  moduleId: 'eventsDynamicPluginsTestWebhook',
  register(env) {
    env.registerInit({
      deps: {
        events: eventsExtensionPoint,
        logger: coreServices.logger,
      },
      async init({ events, logger }) {
        events.addHttpPostIngress(
          createHTTPEventEndpoint(loggerToWinstonLogger(logger)),
        );
      },
    });
  },
});
