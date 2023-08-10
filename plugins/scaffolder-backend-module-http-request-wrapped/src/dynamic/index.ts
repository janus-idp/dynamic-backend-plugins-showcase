import { BackendDynamicPluginInstaller } from '@backstage/backend-plugin-manager';
import { createHttpBackstageAction } from '@roadiehq/scaffolder-backend-module-http-request';

export const dynamicPluginInstaller: BackendDynamicPluginInstaller = {
  kind: 'legacy',
  scaffolder: env => [createHttpBackstageAction({ discovery: env.discovery })],
};
