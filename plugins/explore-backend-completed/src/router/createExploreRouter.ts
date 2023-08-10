import { createRouter } from '@backstage/plugin-explore-backend';
import { exampleTools } from './exampleTools';
import { Logger } from 'winston';
import {
  GetExploreToolsRequest,
  GetExploreToolsResponse,
} from '@backstage/plugin-explore-common';
import { TestBrowserEventSink } from '../browsereventsink/TestBrowserEventSink';
import { intersection, isEmpty } from 'lodash';

export const createExploreRouter = (logger: Logger) =>
  createRouter({
    logger,
    toolProvider: {
      async getTools(
        r: GetExploreToolsRequest,
      ): Promise<GetExploreToolsResponse> {
        return {
          tools: [
            (await TestBrowserEventSink.get()).tool,
            ...exampleTools,
          ].filter(
            t =>
              anyOf(t.tags ?? [], r.filter?.tags ?? []) &&
              anyOf(
                t.lifecycle ? [t.lifecycle] : [],
                r.filter?.lifecycle ?? [],
              ),
          ),
        };
      },
    },
  });

const anyOf = (prop: string[], matches: string[]) =>
  isEmpty(matches) || matches[0] === ''
    ? true
    : intersection([...[prop]].flat(), matches)?.length > 0;
