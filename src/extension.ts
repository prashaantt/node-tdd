import * as Code from 'vscode';

import { NodeTDD } from './NodeTDD';
import { commands } from './constants';

export function activate(context: Code.ExtensionContext) {
    const nodeTdd = NodeTDD.getInstance();

    const activateCommand = Code.commands.registerCommand(commands.ACTIVATE, () => {

        nodeTdd.activate();
    });

    const deactivateCommand = Code.commands.registerCommand(commands.DEACTIVATE, () => {

        nodeTdd.deactivate();
    });

    const toggleOutputCommand = Code.commands.registerCommand(commands.TOGGLE_OUTPUT, () => {

        nodeTdd.toggleOutput();
    });

    const stopBuildCommand = Code.commands.registerCommand(commands.STOP_BUILD, () => {

        nodeTdd.stopBuild();
    });

    context.subscriptions.push(activateCommand, deactivateCommand, toggleOutputCommand, nodeTdd);
}

export function deactivate() { }
