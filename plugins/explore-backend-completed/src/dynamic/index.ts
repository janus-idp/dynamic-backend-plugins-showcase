import { BackendDynamicPluginInstaller } from '@backstage/backend-plugin-manager';
import { HttpPostIngressOptions } from '@backstage/plugin-events-node';
import { TestSubscriber } from '../events/TestSubscriber';
import { createExploreRouter } from '../router/createExploreRouter';

export const dynamicPluginInstaller: BackendDynamicPluginInstaller = {
  kind: 'legacy',
  router: {
    pluginID: 'explore',
    createPlugin: env => createExploreRouter(env.logger),
  },
  events(eventsBackend, env): HttpPostIngressOptions[] {
    eventsBackend.addSubscribers(new TestSubscriber(env.logger));
    return [];
  },
};
