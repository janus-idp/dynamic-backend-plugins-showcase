import { BackendDynamicPluginInstaller } from '@backstage/backend-plugin-manager';
import { catalogModule } from '../module/catalogModule';

export const dynamicPluginInstaller: BackendDynamicPluginInstaller = {
  kind: 'new',
  install: catalogModule,
};
