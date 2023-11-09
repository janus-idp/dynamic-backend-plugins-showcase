# Dynamic backend plugins showcase

## Important note

This repository was initially created to showcase the ongoing work on dynamic plugin loading
in backstage **for backend plugins only**.

Building on top of this initial work, some more progress has been made by the [Janus](https://github.com/janus-idp) community.

Now the [Janus Showcase backstage distribution](https://github.com/janus-idp/backstage-showcase) provides support for dynamic plugins on **both the back-end and front-end**, with the ability to configure them
**without any code change or rebuild of the backstage application**.

This is an early work, and the goal is to integrate, as time goes by, the various improvements made in the Janus community into the backstage main repository.

So you might want to go to the [Janus Showcase repository](https://github.com/janus-idp/backstage-showcase/blob/main/showcase-docs/dynamic-plugins.md) if you want to easily get a taste of dynamic plugins with the latest improvements, 

## Description

This repository contains everything needed to allow testing, experimenting and exploring the
experimental dynamic backend plugins feature provided by the new [backend-plugin-manager](https://github.com/davidfestal/backstage/tree/new-backend-plugin-manager/packages/backend-plugin-manager) package introduced in **PR [#18862](https://github.com/backstage/backstage/pull/18862)** according to Backstage **RFC [#18390](https://github.com/backstage/backstage/issues/18390)**.

It contains:

- front-end and back-end applications that are enabled to support dynamic backend plugins, along with the related configuration file.
- example dynamic plugins that can be used to test the dynamic backend plugins feature.

Here is demo following the steps proposed [below](#proposed-demo-path)

https://github.com/janus-idp/dynamic-backend-plugins-showcase/assets/686586/a9f64c33-e77f-45eb-9716-02b2ea9fc87d

## Usage

### Prerequisites

- You should work at the root of your backstage reporitory.

- The content of this `dynamic-backend-plugins-showcase` repository should be copied into a `dynamic-backend-plugins-showcase` folder at the root of your backstage repository, typically by running the following command in the root of your backstage repository:

  ```bash
  mkdir -p dynamic-backend-plugins-showcase
  curl -s -L https://github.com/janus-idp/dynamic-backend-plugins-showcase/archive/main.tar.gz | tar -xz -C dynamic-backend-plugins-showcase --strip-components=1
  ```

- Copy the dynamic-plugin-enabled backstage application packages to the backstage application:

  ```bash
  cp -R dynamic-backend-plugins-showcase/apps/{app-for-dynamic,backend-next-for-dynamic} packages
  ```

_NOTE: The `app-for-dynamic` package contains no change related to dynamic backend plugin support. It is provided only for the purpose of containing the same minimal list of plugins as the dynamic-plugin-enaled backend applications, in order to make testing easier_

- Install the dependencies of the dynamic plugin enabled backstage application packages:

  ```bash
  yarn install
  ```

### In development mode

- Add the following at the end of the `app-config.local.yaml` file in your backstage repository root directory:

  ```yaml
  dynamicPlugins:
    rootDirectory: dynamic-plugins-root
  ```

- Create the `dynamic-plugins-root` directory in the root of your backstage repository.

- For any example dynamic plugin provided in the `dynamic-backend-plugins-showcase/plugins` root directory, that you want to use, export it and install it into the `dynamic-plugins-root` directory by running the `export-plugin` yarn script in the dynamic plugin directory.

  For example, if you want to install the `catalog-backend-module-test` dynamic plugin, run the following command in the `dynamic-backend-plugins-showcase/plugins/catalog-backend-module-test` directory:

  ```bash
  yarn install && yarn export-dynamic --dev
  ```

  After building and exporting the dynamic plugin to the `dist-dynamic` sub-directory, the `--dev` argument will create a symbolic link, in the `dynamic-plugins-root` directory, to the `dist-dynamic` sub-directory of the exported dynamic plugin package.

  It also links, inside the `dist-dynamic` exported package, to the `src` folder of the dynamic plugin, so that any break-point set in `../dist-dynamic/src` code will be hit when debugging a backstage application with the dynamic plugin installed.

- Start the frontend application, by running the following command in the backstage root directory:

  ```bash
  yarn workspace example-app-for-dynamic start
  ```

- Start the backend application of your choice (legacy or next backend system), by running the following command in the backstage root directory:

  ```bash
  yarn workspace example-backend-next-for-dynamic start
  ```

### In production mode

- In your backstage root directory, run one of the following command to build the dynamic-plugins-enabled backend next application:

  ```bash
  yarn workspace example-backend-next-for-dynamic build
  ```

  This should create a `bundle.tar.gz` file in the `dist` sub-directory of either `packages/backend-for-dynamic` or `packages/backend-next-for-dynamic`, depending on the backend you chose to build.

- Extract the `bundle.tar.gz` file into the `dist-workspace` sub-directory of your backstage root directory:

  ```bash
  mkdir -p dist-workspace
  ```

  and

  ```bash
  tar -xzf packages/backend-next-for-dynamic/dist/bundle.tar.gz -C dist-workspace
  ```

- Change directory to the extracted directory:

  ```bash
  cd dist-workspace
  ```

- Download all the dependencies of the backend application, by running the following command:

  ```bash
  yarn workspaces focus --all --production
  ```

- For each example dynamic plugin located in `dynamic-backend-plugins-showcase/plugins`, build and export the dynamic plugin package by running the following command directly in the dynamic plugin directory:

  ```bash
  yarn install && yarn export-dynamic
  ```

  It will create a `dist-dynamic` sub-directory in the dynamic plugin directory, containing the exported dynamic plugin package.

- In your `dist-workspace` production application root, create a `dynamic-plugins-root` directory, and copy the `dist-dynamic` sub-directory of any dynamic plugin you want to use into it, renamed with the name of the dynamic plugin. For example:

  ```bash
  mkdir dynamic-plugins-root
  for plugin in ../dynamic-backend-plugins-showcase/plugins/*; do
    mkdir -p dynamic-plugins-root/$(basename $plugin)
    cp -R $plugin/dist-dynamic/* dynamic-plugins-root/$(basename $plugin)
  done
  ```

- Start the backend application by running the following command in your `dist-workspace` production application root:

  ```bash
  NODE_ENV=development node packages/backend-next-for-dynamic --config $(pwd)/../app-config.yaml --config $(pwd)/../dynamic-backend-plugins-showcase/apps/app-config.dynamic-plugins-test.yaml
  ```

  _NOTE: The `development` value of the `NODE_ENV` environment variable is only used here to make testing easier, by bypassing some authentication requirements enforced in real production mode._

## Provided Example dynamic plugins

The example dynamic plugins are provided to:

- showcase the various features of the dynamic backend plugins,
- while providing a consistent demo experience.

### `scaffolder-backend-module-http-request-wrapped`

This dynamic plugin is a wrapper on the external `@roadiehq/scaffolder-backend-module-http-request`plugin to make the `http:backstage:request` scaffolder action available as a dynamic plugin.

This plugin shows:

- how to wrap a third-party plugin as a dynamic plugin,
- that dynamic plugins support scaffolder contributions.

### `events-backend-module-test`

This dynamic plugin provides a module that contributes an event http endpoint for the `test-dynamic-plugins` event topic. This will allow to send events to the `test-dynamic-plugins` event topic through the `/events/http/test-dynamic-plugins` backend endpoint.

This plugin shows:

- how to create a dynamic plugin from scratch,
- that dynamic plugins support events contributions.

### `explore-backend-completed`

This dynamic plugin is based on the `explore-backend` plugin, but completes it with additional features, and provides the resulting features as a dynamic plugin.

In addition to providing the `explore` backend endpoint, fed with the typical `exampleTools` static list of tools, it also implements an additional tool and adds its URL to the tools list: the **Browser Event Sink tool**. This tool :

- exposes a dedicated front-end page at the given URL,
- forwards `test-dynamic-plugins` events received by backstage to the front-end through `socket.io`.

This plugin shows:

- how dynamic plugins can extend the functionality of an existing plugin,
- that dynamic plugins can **have their own dependencies** (`socket.io` dependencies) which will be loaded privately when the plugin will be loaded inside the backstage backend application.

### `search-backend-module-explore-wrapped`

This dynamic plugin is a wrapper on the external `@backstage/plugin-search-backend-module-explore`plugin to make the `explore` search collator available as a dynamic plugin.

This plugin shows that dynamic plugins support search contributions.

### `catalog-backend-module-test`

This dynamic plugin provides a module that contributes an `EntitypPovider` to the catalog backend system.

It adds a location with the templates contained in its `templates` folder, so that 3 templates which use the `http:backstage:request` scaffolder action will become automatically available as soon as the dynamic plugin is loaded:

- `List Explore Tools`: hits the `explore` backend endpoint to list the tools,
- `Get Browser Event Sink Tool URL`: retrieves the URL of the **Browser Event Sink** tool.
- `Send Message Event`: sends a message event to the `test-dynamic-plugins` http endpoint.

## Proposed Demo Path

- Start Without any dynamic plugin installed: the backstage application doesn't contain any entity or location; search doesn't return any result, the `/explore/tools` endpoint is unavailable as is the `/events/http/test-dynamic-plugins` endpoint.

- Add the `scaffolder-backend-module-http-request-wrapped` dynamic plugin in the dynamic plugins root and restart. You will see that the `http:backstage:request` scaffolder action is now available in the scaffolder.

- Add the `events-backend-module-test` dynamic plugin in the dynamic plugins root and restart. You will see that the `/events/http/test-dynamic-plugins` endpoint is now available.

- Add the `explore-backend-completed` dynamic plugin in the dynamic plugins root and restart. You will see that the `/explore/tools` endpoint is now available, and that the `Browser Event Sink` tool is now available in the tools list.

- Add the `search-backend-module-explore-wrapped` dynamic plugin in the dynamic plugins root and restart. You will see that the Explore tools now appear in the search results.

- Add the `catalog-backend-module-test` dynamic plugin in the dynamic plugins root and restart. You will see that the `dynamic-plugins-test-templates-location` location has been added to the catalog, and that the 3 templates provided by the dynamic plugin are now available in the scaffolder:
  - Use the `List Explore Tools` to query the `explore/tools` endpoint and get a filtered list of tools.
  - Use the `Get Browser Event Sink Tool URL` to open the **Browser Event Sink** URL in a distinct tab.
  - Use the `Send Message Event` to send a message event to the `test-dynamic-plugins` http endpoint, and notice that the message is displayed in the **Browser Event Sink** tool (having been forwarded to the browser by the `explore-backend-completed` dynamic plugin through `socket.io`).

## Details

### About the expected dynamic plugin structure

Due to some limitations of the current backstage codebase, and to ensure compatibility with the legacy backend system (until it is replaced by the next backend), the plugins need to be completed and repackaged to by used as dynamic plugins:

1. they must provide a named entry point of a specific type (which can be found in the `src/dynamic` sub-folder of each dynamic plugin example).
2. they would have a modified `package.json` file in which dependencies are updated to share `@backstage` dependencies with the main application.
3. they may embed some dependency whose code is then merged with the plugin code.

Points 2 and 3 are done by the `export-dynamic` yarn scripts, which use the `export-dynamic-plugin` CLI command to perform the repackaging

### About the `export-dynamic-plugin` command

The `export-dynamic-plugin` CLI command, used by the `yarn export-dynamic` scripts in the dynamic plugin examples, is part of a `@backstage/cli` fork (`@dfatwork-pkgs/backstage-cli@0.22.9-next.6`), and is used here to help packaging the dynamic plugins according to the constraints mentioned above, in order to allow straightforward testing of the dynamic plugins feature.

However the `backend-plugin-manager` experimental package doesn't depend on the use of this additional CLI command, and in future steps of this backend dynamic plugin work, the use of such a dedicated command might not even be necessary.

### About the support of the legacy backend system

The backend dynamic plugins feature clearly targets the new backend system.
However if it should absolutely be tested or explored on the legacy backend, a dedicated example backend application is provided in a [dedicated showcase repository](https://github.com/janus-idp/dynamic-backend-plugins-showcase-legacy-backend#readme).
