import * as Code from 'vscode';

import { TestRunner } from './TestRunner';
import { constants } from './constants';

let testRunner: TestRunner;

export function activate(context: Code.ExtensionContext) {
    const config = Code.workspace.getConfiguration(constants.CONFIG_SECTION_KEY);

    testRunner = new TestRunner(config);

    if (config.get('runOnActivation')) {
        testRunner.run();
    }

    Code.commands.registerCommand('nodeTdd.activate', () => {

        const activated = testRunner.activate();

        if (activated !== false && config.get('runOnActivation')) {

            testRunner.run();
        }
    });

    Code.commands.registerCommand('nodeTdd.deactivate', () => {

        testRunner.deactivate();
    });

    Code.commands.registerCommand('nodeTdd.showOutput', () => {

        testRunner.toggleOutputChannel();
    });
}

export function deactivate() {
    if (testRunner) {
        testRunner.dispose();
    }
}
