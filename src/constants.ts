import { getMessage, Status, Report } from './utils';

export const commands = {
    ACTIVATE: 'nodeTdd.activate',
    DEACTIVATE: 'nodeTdd.deactivate',
    TOGGLE_OUTPUT: 'nodeTdd.toggleOutput',
    STOP_BUILD: 'nodeTdd.stopBuild',
};

export const config = {
    CONFIG_SECTION_KEY: 'nodeTdd',
    OUTPUT_CHANNEL_NAME: 'TDD',

    BUILDING_ANIMATION_SPEED: 333,
    DEBOUNCE_WAIT_TIME: 400,
    FAILING_COLOUR: '#ff9b9b',
    PASSING_COLOUR: '#55e269',

    ACTIVATE_ON_STARTUP: { name: 'activateOnStartup', defaultValue: true },
    TEST_SCRIPT: { name: 'testScript', defaultValue: 'test' },
    GLOB: { name: 'glob', defaultValue: '{test,src}/**/*.{js,ts,jsx,tsx}' },
    REPORTER: { name: 'reporter', defaultValue: null },
    VERBOSE: { name: 'verbose', defaultValue: false },
    MINIMAL: { name: 'minimal', defaultValue: false },
    BUILD_ON_ACTIVATION: { name: 'buildOnActivation', defaultValue: false },
    BUILD_ON_CREATE: { name: 'buildOnCreate', defaultValue: false },
    BUILD_ON_DELETE: { name: 'buildOnDelete', defaultValue: false },
    SHOW_COVERAGE: { name: 'showCoverage', defaultValue: false },
    COVERAGE_THRESHOLD: { name: 'coverageThreshold', defaultValue: null },
    // deprecated
    RUN_ON_ACTIVATION: { name: 'runOnActivation', defaultValue: false }
};

export const messages = {
    ACTIVATE_EXTENSION: {
        text: 'TDD $(rocket)',
        tooltip: 'Deactivate TDD mode',
        command: commands.DEACTIVATE,
    },

    DEACTIVATE_EXTENSION: {
        text: 'TDD $(circle-slash)',
        tooltip: 'Activate TDD mode',
        command: commands.ACTIVATE,
    },

    failing: async function (minimal: boolean, report?: Report) {
        const message = await getMessage(Status.FAILING, minimal, report);

        return {
            text: message.text,
            color: config.FAILING_COLOUR,
            tooltip: message.tooltip,
            command: commands.TOGGLE_OUTPUT
        };
    },

    FAILING_DIALOG: 'Node TDD: The build failed',

    passing: async function (minimal: boolean, report?: Report) {
        const message = await getMessage(Status.PASSING, minimal, report);

        return {
            text: message.text,
            color: config.PASSING_COLOUR,
            tooltip: message.tooltip,
            command: commands.TOGGLE_OUTPUT
        };
    },

    PASSING_DIALOG: 'Node TDD: The build passed',

    SHOW_OUTPUT_DIALOG: 'Show output',

    building: function (minimal: boolean) {
        return {
            text: minimal ? '$(tools)' : '$(tools) Building',
            color: 'inherit',
            tooltip: 'Stop current build',
            command: commands.STOP_BUILD
        };
    },

    buildStopped: function (minimal: boolean) {
        return {
            text: minimal ? '$(stop)' : 'Build stopped',
            color: 'inherit',
            tooltip: minimal ? 'Build stopped' : '',
            command: ''
        };
    },

    STOPPED_DIALOG: 'Node TDD: The build was stopped',

    OPEN_PACKAGE_JSON: 'Open package.json',

    PACKAGE_JSON_NOT_FOUND: 'Node TDD: package.json was not found',

    DEACTIVATE_DIALOG: 'Deactivate TDD mode',

    coverage: function (coverage: number, threshold: number | null, minimal: boolean) {
        return {
            text: minimal ? `${coverage}` : `$(dashboard) ${coverage}%`,
            tooltip: 'Test coverage',
            color: threshold ? (coverage >= threshold ?
                config.PASSING_COLOUR : config.FAILING_COLOUR) : 'inherit',
            command: commands.TOGGLE_OUTPUT
        };
    },

    scriptNotFound: function (scriptName: string) {
        return `Node TDD: The npm script \`${scriptName}\` was not found`;
    }
};
