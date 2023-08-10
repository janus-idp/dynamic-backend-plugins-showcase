import {
  coreServices,
  createBackendModule,
} from '@backstage/backend-plugin-api';
import { eventsExtensionPoint } from '@backstage/plugin-events-node/alpha';
import { TestSubscriber } from '../events/TestSubscriber';
import { loggerToWinstonLogger } from '@backstage/backend-common';

/**
 * Module for the events-backend plugin, adding an event subscriber that logs the event
 * to the web-browser page served by a dedicated http server provided as a tool.
 */
export const eventsModuleSubscriber = createBackendModule({
  pluginId: 'events',
  moduleId: 'eventsDynamicPluginsTestSubscriber',
  register(env) {
    env.registerInit({
      deps: {
        events: eventsExtensionPoint,
        logger: coreServices.logger,
        http: coreServices.httpRouter,
      },
      async init({ events, logger, http }) {
        events.addSubscribers(
          new TestSubscriber(loggerToWinstonLogger(logger)),
        );
      },
    });
  },
});
