import {
  EntityProvider,
  EntityProviderConnection,
} from '@backstage/plugin-catalog-node';
import { ANNOTATION_LOCATION } from '@backstage/catalog-model';
import { ANNOTATION_ORIGIN_LOCATION } from '@backstage/catalog-model';
import { stringifyLocationRef } from '@backstage/catalog-model';
import { findPaths } from '@backstage/cli-common';

export class TemplatesEntityProvider implements EntityProvider {
  getProviderName(): string {
    return 'TestTemplatesLocationProvider';
  }

  async connect(connection: EntityProviderConnection): Promise<void> {
    const location = {
      type: 'file',
      target: findPaths(__dirname).resolveOwn('templates', '*.yaml'),
    };
    const locationRef = stringifyLocationRef(location);

    const locationEntity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Location',
      metadata: {
        name: 'dynamic-plugins-test-templates-location',
        annotations: {
          [ANNOTATION_LOCATION]: locationRef,
          [ANNOTATION_ORIGIN_LOCATION]: locationRef,
        },
        description: `## Test location for dynamic plugins, added through a dynamic catalog module.

### Another title

And some **more** text
`,
      },
      spec: {
        type: location.type,
        target: location.target,
      },
    };

    await connection.applyMutation({
      type: 'full',
      entities: [
        {
          entity: locationEntity,
          locationKey: locationRef,
        },
      ],
    });
  }
}
