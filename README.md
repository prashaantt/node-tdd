# node-tdd

> A [Visual Studio Code](http://code.visualstudio.com/) extension to ease [test-driven development](https://en.wikipedia.org/wiki/Test-driven_development) in Node/JavaScript

## Features

![feature X](images/node-tdd.gif)

- Activates when a workspace containing `package.json` is opened.
- Triggers an automatic test build whenever source files are updated.
- Shows a colour-coded build summary.
- Shows the average test coverage (experimental).

## Settings

This extension contributes the following settings:

| Setting                     | Type           | Default                           | Description                                                     |
| --------------------------- | -------------- | --------------------------------- | --------------------------------------------------------------- |
| `nodeTdd.activateOnStartup` | boolean        | `true`                            | Activate TDD mode when workspace is opened                      |
| `nodeTdd.testScript`        | string         | `test`                            | The npm script to run tests                                     |
| `nodeTdd.glob`              | string         | `{test,src}/**/*.{js,ts,jsx,tsx}` | Glob pattern for files to watch, relative to the workspace root |
| `nodeTdd.runOnActivation`   | boolean        | `false`                           | Run tests as soon as TDD mode gets (re-)activated               |
| `nodeTdd.verbose`           | boolean        | `false`                           | Show (more intrusive) build status dialogs                      |
| `nodeTdd.buildOnCreate`     | boolean        | `false`                           | Run tests when matching files are created                       |
| `nodeTdd.buildOnDelete`     | boolean        | `false`                           | Run tests when matching files are deleted                       |
| `nodeTdd.showCoverage`      | boolean        | `false`                           | Show the average test coverage if reported (experimental)       |
| `nodeTdd.coverageThreshold` | number \| null | `null`                            | The threshold percentage, used to colour-code the coverage      |

## Commands

The following commands are available from the commands menu as well as convenience status bar buttons:

| Command        | Action                                |
| -------------- | ------------------------------------- |
| `activate`     | Activate `node-tdd` in a workspace    |
| `deactivate`   | De-activate `node-tdd` in a workspace |
| `toggleOutput` | Toggle detailed test results output   |
| `stopBuild`    | Stop a running build                  |

## Limitations and known issues

- The extension doesn't get activated if `package.json` was not initially present when the workspace was opened; a window restart will be required to detect a change.
- It doesn't work with watch mode/incremental test builds. The build process used for running tests must exit on each execution, otherwise it will never report the status.
- `showCoverage` is an experimental setting, only tested with [Lab](https://github.com/hapijs/lab) and [Istanbul](https://github.com/gotwarlost/istanbul). Disable it if its output looks funny.
- Ironically for a TDD extension, it has very few tests of its own because I don't yet know how to test UI elements in VS Code. :/

Suggestions and PRs are welcome.

## License

MIT License.
