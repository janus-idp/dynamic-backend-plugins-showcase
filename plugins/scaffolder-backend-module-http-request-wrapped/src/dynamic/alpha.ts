import { BackendDynamicPluginInstaller } from '@backstage/backend-plugin-manager';
import {
  coreServices,
  createBackendModule,
} from '@backstage/backend-plugin-api';
import { scaffolderActionsExtensionPoint } from '@backstage/plugin-scaffolder-node/alpha';
import { createHttpBackstageAction } from '@roadiehq/scaffolder-backend-module-http-request';

export const dynamicPluginInstaller: BackendDynamicPluginInstaller = {
  kind: 'new',
  install: createBackendModule({
    moduleId: 'scaffolder-backend-module-http-request',
    pluginId: 'scaffolder',
    register(env) {
      env.registerInit({
        deps: {
          scaffolder: scaffolderActionsExtensionPoint,
          discovery: coreServices.discovery,
        },
        async init({ scaffolder, discovery }) {
          scaffolder.addActions(createHttpBackstageAction({ discovery }));
        },
      });
    },
  }),
};
