import { BackendDynamicPluginInstaller } from '@backstage/backend-plugin-manager';
import { searchModuleExploreCollator } from '@backstage/plugin-search-backend-module-explore/alpha';

export const dynamicPluginInstaller: BackendDynamicPluginInstaller = {
  kind: 'new',
  install: searchModuleExploreCollator,
};
