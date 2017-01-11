export const constants = {
    CONFIG_SECTION_KEY: 'nodeTdd',
    SHOW_OUTPUT_COMMAND: 'nodeTdd.toggleOutput',
    OUTPUT_CHANNEL_NAME: 'TDD',

    ACTIVATE_EXTENSION: {
        text: 'TDD $(rocket)',
        tooltip: 'TDD mode is active',
        command: 'nodeTdd.deactivate',
    },

    DEACTIVATE_EXTENSION: {
        text: 'TDD $(circle-slash)',
        tooltip: 'TDD mode is inactive',
        command: 'nodeTdd.activate',
    },

    FAILING_MESSAGE: {
        text: '$(alert) Failing',
        color: '#ff7373',
        tooltip: 'Toggle output',
        command: 'nodeTdd.toggleOutput'
    },

    PASSING_MESSAGE: {
        text: '$(check) Passing',
        color: '#55e269',
        tooltip: 'Toggle output',
        command: 'nodeTdd.toggleOutput'
    },

    BUILDING_TEXT: '$(tools) Building',
    BUILDING_TEXT_COLOR: 'inherit',
    BUILDING_ANIMATION_SPEED: 300,

    scriptNotFound: function (scriptName: string) {
        return `Node TDD: npm script '${scriptName}' not found.`;
    },

    OPEN_PACKAGE_JSON: 'Open package.json'
}
