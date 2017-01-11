import * as Code from 'vscode';

import { NodeTDD } from './NodeTDD';

let nodeTdd: NodeTDD;

export function activate() {
    nodeTdd = NodeTDD.getInstance();

    Code.commands.registerCommand('nodeTdd.activate', () => {

        nodeTdd.activate();
    });

    Code.commands.registerCommand('nodeTdd.deactivate', () => {

        nodeTdd.deactivate();
    });

    Code.commands.registerCommand('nodeTdd.toggleOutput', () => {

        nodeTdd.toggleOutput();
    });
}

export function deactivate() {
    if (nodeTdd) {
        nodeTdd.dispose();
    }
}
