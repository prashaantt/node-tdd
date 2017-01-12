export const commands = {
    ACTIVATE: 'nodeTdd.activate',
    DEACTIVATE: 'nodeTdd.deactivate',
    TOGGLE_OUTPUT: 'nodeTdd.toggleOutput',
    STOP_BUILD: 'nodeTdd.stopBuild',
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
        color: '#ff7373',
        tooltip: 'Toggle output',
        command: commands.TOGGLE_OUTPUT
    },

    PASSING_MESSAGE: {
        text: '$(check) Passing',
        color: '#55e269',
        tooltip: 'Toggle output',
        command: commands.TOGGLE_OUTPUT
    },

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

    BUILDING_ANIMATION_SPEED: 300,

    scriptNotFound: function (scriptName: string) {
        return `Node TDD: npm script '${scriptName}' not found.`;
    },

    OPEN_PACKAGE_JSON: 'Open package.json'
}
