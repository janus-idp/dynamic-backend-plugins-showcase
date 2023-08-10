import { BackendDynamicPluginInstaller } from '@backstage/backend-plugin-manager';
import { HttpPostIngressOptions } from '@backstage/plugin-events-node';
import { createHTTPEventEndpoint } from '../http/createHTTPEventEndpoint';

export const dynamicPluginInstaller: BackendDynamicPluginInstaller = {
  kind: 'legacy',
  events(eventsBackend, env): HttpPostIngressOptions[] {
    return [createHTTPEventEndpoint(env.logger)];
  },
};
