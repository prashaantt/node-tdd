import * as Code from 'vscode';

import { NodeTDD } from './NodeTDD';

export function activate(context: Code.ExtensionContext) {
    const nodeTdd = NodeTDD.getInstance();

    const activateCommand = Code.commands.registerCommand('nodeTdd.activate', () => {

        nodeTdd.activate();
    });

    const deactivateCommand = Code.commands.registerCommand('nodeTdd.deactivate', () => {

        nodeTdd.deactivate();
    });

    const toggleOutputCommand = Code.commands.registerCommand('nodeTdd.toggleOutput', () => {

        nodeTdd.toggleOutput();
    });

    context.subscriptions.push(activateCommand, deactivateCommand, toggleOutputCommand, nodeTdd);
}

export function deactivate() { }
