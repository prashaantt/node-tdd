export const commands = {
    ACTIVATE: 'nodeTdd.activate',
    DEACTIVATE: 'nodeTdd.deactivate',
    TOGGLE_OUTPUT: 'nodeTdd.toggleOutput',
    STOP_BUILD: 'nodeTdd.stopBuild',
}

const FAILING_COLOUR = '#ff9b9b';
const PASSING_COLOUR = '#55e269';

export const config = {
    ACTIVATE_ON_STARTUP: 'activateOnStartup',
    RUN_ON_ACTIVATION: 'runOnActivation',
    VERBOSE: 'verbose',
    TEST_SCRIPT: 'testScript',
    GLOB: 'glob',
    BUILD_ON_CREATE: 'buildOnCreate',
    BUILD_ON_DELETE: 'buildOnDelete',
    SHOW_COVERAGE: 'showCoverage',
    COVERAGE_THRESHOLD: 'coverageThreshold'
}

export const constants = {
    CONFIG_SECTION_KEY: 'nodeTdd',

    OUTPUT_CHANNEL_NAME: 'TDD',

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

    FAILING_MESSAGE: {
        text: '$(alert) Failing',
        color: FAILING_COLOUR,
        tooltip: 'Toggle output',
        command: commands.TOGGLE_OUTPUT
    },

    FAILING_DIALOG_MESSAGE: 'Node TDD: The build failed',

    PASSING_MESSAGE: {
        text: '$(check) Passing',
        color: PASSING_COLOUR,
        tooltip: 'Toggle output',
        command: commands.TOGGLE_OUTPUT
    },

    PASSING_DIALOG_MESSAGE: 'Node TDD: The build passed',

    SHOW_OUTPUT_DIALOG_MESSAGE: 'Show output',

    BUILDING_MESSAGE: {
        text: '$(tools) Building',
        color: 'inherit',
        tooltip: 'Click to stop current build',
        command: commands.STOP_BUILD
    },

    BUILD_STOPPED_MESSAGE: {
        text: 'Build stopped',
        color: 'inherit',
        tooltip: '',
        command: ''
    },

    STOPPED_DIALOG_MESSAGE: 'Node TDD: The build was stopped',

    BUILDING_ANIMATION_SPEED: 300,

    coverageMessage: function (coverage: number, threshold: number | null) {
        return {
            text: `$(dashboard) ${coverage}%`,
            tooltip: 'Test coverage',
            color: threshold ? (coverage >= threshold ? PASSING_COLOUR : FAILING_COLOUR) : 'inherit'
        }
    },

    scriptNotFoundMessage: function (scriptName: string) {
        return `Node TDD: npm script \`${scriptName}\` was not found`;
    },

    OPEN_PACKAGE_JSON: 'Open package.json'
}
