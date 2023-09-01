/*
 * Copyright 2022 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { createBackend } from '@backstage/backend-defaults';
import {
  dynamicPluginsServiceFactory,
  dynamicPluginsFeatureDiscoveryServiceFactory,
} from '@backstage/backend-plugin-manager';
import { appPlugin } from '@backstage/plugin-app-backend/alpha';
import { catalogPlugin } from '@backstage/plugin-catalog-backend/alpha';
import {
  permissionModuleAllowAllPolicy,
  permissionPlugin,
} from '@backstage/plugin-permission-backend/alpha';
import { scaffolderPlugin } from '@backstage/plugin-scaffolder-backend/alpha';
import { catalogModuleTemplateKind } from '@backstage/plugin-scaffolder-backend/alpha';
import { searchModuleCatalogCollator } from '@backstage/plugin-search-backend-module-catalog/alpha';
import { searchModuleTechDocsCollator } from '@backstage/plugin-search-backend-module-techdocs/alpha';
import { searchPlugin } from '@backstage/plugin-search-backend/alpha';
import { techdocsPlugin } from '@backstage/plugin-techdocs-backend/alpha';
import { eventsPlugin } from '@backstage/plugin-events-backend/alpha';

const backend = createBackend();

backend.add(dynamicPluginsFeatureDiscoveryServiceFactory()) // overridden version of the FeatureDiscoveryService which provides features loaded by dynamic plugins
backend.add(dynamicPluginsServiceFactory())

backend.add(appPlugin());

// Techdocs
backend.add(techdocsPlugin());

// Catalog
backend.add(catalogPlugin());
backend.add(catalogModuleTemplateKind());

backend.add(scaffolderPlugin());

// Search
backend.add(searchPlugin());
backend.add(searchModuleCatalogCollator());
backend.add(searchModuleTechDocsCollator());

// Permissions
backend.add(permissionPlugin());
backend.add(permissionModuleAllowAllPolicy());

// Events
backend.add(eventsPlugin());

backend.start();
