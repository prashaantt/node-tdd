export const commands = {
    ACTIVATE: 'nodeTdd.activate',
    DEACTIVATE: 'nodeTdd.deactivate',
    TOGGLE_OUTPUT: 'nodeTdd.toggleOutput',
    STOP_BUILD: 'nodeTdd.stopBuild',
};

export const config = {
    CONFIG_SECTION_KEY: 'nodeTdd',
    OUTPUT_CHANNEL_NAME: 'TDD',

    BUILDING_ANIMATION_SPEED: 300,
    DEBOUNCE_WAIT_TIME: 400,
    FAILING_COLOUR: '#ff9b9b',
    PASSING_COLOUR: '#55e269',

    ACTIVATE_ON_STARTUP: { name: 'activateOnStartup', defaultValue: true },
    TEST_SCRIPT: { name: 'testScript', defaultValue: 'test' },
    GLOB: { name: 'glob', defaultValue: '{test,src}/**/*.{js,ts,jsx,tsx}' },
    VERBOSE: { name: 'verbose', defaultValue: false },
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
        tooltip: 'Click to deactivate TDD mode',
        command: commands.DEACTIVATE,
    },

    DEACTIVATE_EXTENSION: {
        text: 'TDD $(circle-slash)',
        tooltip: 'Click to activate TDD mode',
        command: commands.ACTIVATE,
    },

    FAILING: {
        text: '$(alert) Failing',
        color: config.FAILING_COLOUR,
        tooltip: 'Toggle output',
        command: commands.TOGGLE_OUTPUT
    },

    FAILING_DIALOG: 'Node TDD: The build failed',

    PASSING: {
        text: '$(check) Passing',
        color: config.PASSING_COLOUR,
        tooltip: 'Toggle output',
        command: commands.TOGGLE_OUTPUT
    },

    PASSING_DIALOG: 'Node TDD: The build passed',

    SHOW_OUTPUT_DIALOG: 'Show output',

    BUILDING: {
        text: '$(tools) Building',
        color: 'inherit',
        tooltip: 'Click to stop current build',
        command: commands.STOP_BUILD
    },

    BUILD_STOPPED: {
        text: 'Build stopped',
        color: 'inherit',
        tooltip: '',
        command: ''
    },

    STOPPED_DIALOG: 'Node TDD: The build was stopped',

    OPEN_PACKAGE_JSON: 'Open package.json',

    PACKAGE_JSON_NOT_FOUND: 'Node TDD: package.json was not found',

    DEACTIVATE_DIALOG: 'Deactivate TDD mode',

    coverage: function (coverage: number, threshold: number | null) {
        return {
            text: `$(dashboard) ${coverage}%`,
            tooltip: 'Test coverage',
            color: threshold ? (coverage >= threshold ?
                config.PASSING_COLOUR : config.FAILING_COLOUR) : 'inherit'
        };
    },

    scriptNotFound: function (scriptName: string) {
        return `Node TDD: The npm script \`${scriptName}\` was not found`;
    }
};
