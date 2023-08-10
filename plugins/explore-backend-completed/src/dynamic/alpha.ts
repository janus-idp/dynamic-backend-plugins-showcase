import { BackendDynamicPluginInstaller } from '@backstage/backend-plugin-manager';
import { eventsModuleSubscriber } from '../module/eventsModuleSubscriber';
import { explorebackendPlugin } from '../module/exploreBackendPlugin';

export const dynamicPluginInstaller: BackendDynamicPluginInstaller = {
  kind: 'new',
  install: () => [explorebackendPlugin(), eventsModuleSubscriber()],
};
