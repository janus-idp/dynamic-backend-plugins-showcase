import { BackendDynamicPluginInstaller } from '@backstage/backend-plugin-manager';
import { TemplatesEntityProvider } from '../provider/TemplatesEntityProvider';

export const dynamicPluginInstaller: BackendDynamicPluginInstaller = {
  kind: 'legacy',
  catalog(builder) {
    builder.addEntityProvider(new TemplatesEntityProvider());
  },
};
