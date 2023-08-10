import { BackendDynamicPluginInstaller } from '@backstage/backend-plugin-manager';
import { eventsModuleWebhook } from '../module/eventsModuleWebhook';

export const dynamicPluginInstaller: BackendDynamicPluginInstaller = {
  kind: 'new',
  install: eventsModuleWebhook,
};
