# Gel UI web app

Note: If you are just looking to use Gel UI, then you don't need to do any of
these steps, just run the `gel ui` command from your project directory.

## Development

> **Prerequisites**: You will need to have Yarn 2+ installed, and have run the
> `yarn` command to install the workspace's dependencies.

To start the UI dev server:

```sh
yarn dev
```

The app is served at `http://localhost:3002/ui`.

Gel server needs to be run separately, with the recommended way being to use a recent build of the local dev server (see the docs for more details: <https://docs.geldata.com/resources/guides/contributing/code>):

```sh
edb server
```

If using a non-dev Gel server instance (eg. installed using the `gel` cli), the instance first needs to be configured to allow the dev UI's origin:
```sh
# Only needs to be run once:
gel configure set cors_allow_origins '*'
```

Then the following env vars need to be configured when running the UI dev server (recommended to add them to a `.env.local` file in `web`):
```
GEL_SERVER_URL=localhost:10700
GEL_SERVER_VERSION=6.8
```
Note: The values for your instance can be found from `gel instance list`. Also if you don't have username+password auth configured, an auth token for the UI can be created by running `gel ui --print-url`, and replacing the host/port in the url with `localhost:3002`.

## UI Tests

> **Prerequisites**: The UI tests use Playwright, so you may need to run `yarn create playwright` to install the browser components Playwright needs.

To run the UI tests:

```sh
yarn test
```

If there is already an instance of an Gel dev server running on port 5656,
or the UI dev server running on port 3000, then they will be used by the tests.
If not (or the tests are running in CI), the test runner will start temporary
instances of them for the duration of the tests.

### Writing tests

The tests use the [Playwright](https://playwright.dev/) framework, with some custom setup/teardown in `web/playwright` to setup test databases in a local dev server instance. See the [Playwright docs](https://playwright.dev/docs/writing-tests) for more details on writing tests using Playwright.
