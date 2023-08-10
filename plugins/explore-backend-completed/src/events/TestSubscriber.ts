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

import { EventParams, EventSubscriber } from '@backstage/plugin-events-node';
import { Logger } from 'winston';
import { TestBrowserEventSink } from '../browsereventsink/TestBrowserEventSink';

export class TestSubscriber implements EventSubscriber {
  constructor(private logger: Logger) {
    this.logger = logger;
  }

  supportsEventTopics(): string[] {
    return ['test-dynamic-plugins'];
  }

  async onEvent(params: EventParams): Promise<void> {
    this.logger.info(
      `Dynamic Plugins Test: Received event from ${
        params.topic
      } by the TestSubscriber: ${JSON.stringify(params.eventPayload)}`,
    );
    (await TestBrowserEventSink.get()).sendEventToBrowser(params.eventPayload);
  }
}
