# Change Log
All notable changes to `node-tdd` will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) and this project adheres to [Semantic Versioning](http://semver.org/).

## [0.2.0] - 2017-01-23
### Added
- `minimal` setting to declutter the status bar.
- `reporter` setting to parse [TAP](https://testanything.org/producers.html#javascript) outputs.

### Removed
- The deprecated `runOnActivation` setting.

## [0.1.1] - 2017-01-17
### Changed
- Deprecated the `runOnActivation` setting in favour of `buildOnActivation` for better consistency in config names. `runOnActivation` will be removed in the next release.
- (Internal) Now using [`spawn`](https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options) instead of [`exec`](https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback) to run tests.

### Fixed
- Fixed an issue with coverage reporting.

## [0.1.0] - 2017-01-15
- Initial release
