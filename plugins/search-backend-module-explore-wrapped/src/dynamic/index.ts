import { BackendDynamicPluginInstaller } from '@backstage/backend-plugin-manager';
import { ToolDocumentCollatorFactory } from '@backstage/plugin-search-backend-module-explore';

export const dynamicPluginInstaller: BackendDynamicPluginInstaller = {
  kind: 'legacy',
  search(indexBuilder, schedule, env) {
    indexBuilder.addCollator({
      schedule,
      factory: ToolDocumentCollatorFactory.fromConfig(env.config, {
        discovery: env.discovery,
        logger: env.logger,
      }),
    });
  },
};
