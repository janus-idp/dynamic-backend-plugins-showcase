import { createBackendModule } from '@backstage/backend-plugin-api';
import { TemplatesEntityProvider } from '../provider/TemplatesEntityProvider';
import { catalogProcessingExtensionPoint } from '@backstage/plugin-catalog-node/alpha';

/**
 * Module for the catalog-backend plugin, adding 2 templates
 * that allow testing additional dynamic plugins by using the
 * http-request scaffolder action (also added dynamically)
 *
 */
export const catalogModule = createBackendModule({
  pluginId: 'catalog',
  moduleId: 'catalogDynamicPluginsTestProvider',
  register(env) {
    env.registerInit({
      deps: {
        catalog: catalogProcessingExtensionPoint,
      },
      async init({ catalog }) {
        catalog.addEntityProvider(new TemplatesEntityProvider());
      },
    });
  },
});
