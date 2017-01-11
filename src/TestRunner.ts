import { exec } from 'child_process';
import { readFile } from 'fs';
import { resolve } from 'path';
import { window, workspace, FileSystemWatcher } from 'vscode';

import { NodeTDD } from './NodeTDD';
import { constants } from './constants';

export class TestRunner {
    private fsWatcher: FileSystemWatcher | null;
    private running = false;

    watch() {
        const buildOnCreate = NodeTDD.getConfig().get<boolean>('buildOnCreate');
        const buildOnDelete = NodeTDD.getConfig().get<boolean>('buildOnDelete');

        if (!this.fsWatcher) {
            const globPath = resolve(workspace.rootPath, NodeTDD.getConfig().get<string>('glob'));

            this.fsWatcher = workspace.createFileSystemWatcher(
                globPath, true, buildOnCreate, buildOnDelete);
        }

        this.fsWatcher.onDidChange(debounce(this.run.bind(this)));

        if (buildOnCreate) {
            this.fsWatcher.onDidCreate(debounce(this.run.bind(this)));
        }

        if (buildOnDelete) {
            this.fsWatcher.onDidDelete(debounce(this.run.bind(this)));
        }

        if (NodeTDD.getConfig().get<boolean>('runOnActivation')) {
            this.run();
        }
    }

    dispose() {
        if (this.fsWatcher) {
            this.fsWatcher.dispose();
        }

        this.fsWatcher = null;
    }

    private get testCommand() {
        const scriptName = NodeTDD.getConfig().get<string>('testScript').trim();

        return scriptName === 'test' ? 'npm test' : `npm run ${scriptName}`;
    }

    private async run() {
        if (this.running) {
            return;
        }

        let packageObj;

        try {
            const packageJSON = await readFileAsync(workspace.rootPath + '/package.json');

            packageObj = JSON.parse(packageJSON);
        }
        catch (err) {

            return;
        }

        const scriptName = NodeTDD.getConfig().get<string>('testScript').trim();

        if (!packageObj.scripts[scriptName]) {
            const selection = await window.showErrorMessage(
                constants.scriptNotFound(scriptName), constants.OPEN_PACKAGE_JSON).then();

            if (selection === constants.OPEN_PACKAGE_JSON) {
                workspace.openTextDocument(workspace.rootPath + '/package.json')
                    .then(textDocument => {

                        window.showTextDocument(textDocument);
                    });
            }

            return;
        }

        this.running = true;

        NodeTDD.getInstance().clearOutput();

        NodeTDD.getInstance().setBuildStatusBar({
            text: constants.BUILDING_TEXT,
            color: constants.BUILDING_TEXT_COLOR
        });
        NodeTDD.getInstance().showBuildStatusBar();

        let count = 1;

        const interval = setInterval(() => {

            NodeTDD.getInstance().setBuildStatusBar({
                text: constants.BUILDING_TEXT + '.'.repeat(count++ % 4)
            });
        }, constants.BUILDING_ANIMATION_SPEED);

        exec(this.testCommand, { cwd: workspace.rootPath }, async (error, stdout, stderr) => {

            clearInterval(interval);

            this.running = false;

            if (stderr) {
                NodeTDD.getInstance().setBuildStatusBar(constants.FAILING_MESSAGE);
            }
            else if (stdout) {
                NodeTDD.getInstance().setBuildStatusBar(constants.PASSING_MESSAGE);

                NodeTDD.getInstance().hideOutput();
            }

            NodeTDD.getInstance().setOutput(stdout);
        });
    }
}

function debounce(func: Function, wait = 400, immediate?: boolean) {
    let timeout: NodeJS.Timer | null;

    return function () {
        const context = this;
        const args = arguments;

        const later = function () {
            timeout = null;

            if (!immediate) {
                func.apply(context, args);
            }
        };

        const callNow = immediate && !timeout;

        timeout && clearTimeout(timeout);

        timeout = setTimeout(later, wait);

        if (callNow) {
            func.apply(context, args);
        }
    };
};

function readFileAsync(path: string) {
    return new Promise<string>((resolve, reject) => {

        readFile(path, 'utf8', (err, data) => {
            if (err) {
                return reject(err);
            }

            return resolve(data);
        });
    });
}
