import { exec, ChildProcess } from 'child_process';
import { resolve } from 'path';
import { window, workspace, FileSystemWatcher } from 'vscode';
import { debounce } from 'lodash';

import { NodeTDD } from './NodeTDD';
import { messages, config } from './constants';
import { parseCoverage, readFileAsync } from './utils';

export class TestRunner {
    private fsWatcher: FileSystemWatcher | null = null;
    private process: ChildProcess | null = null;

    watch() {
        const buildOnCreate = NodeTDD.getConfig<boolean>(config.BUILD_ON_CREATE);
        const buildOnDelete = NodeTDD.getConfig<boolean>(config.BUILD_ON_DELETE);

        if (!this.fsWatcher) {
            const globPath = resolve(workspace.rootPath, NodeTDD.getConfig<string>(config.GLOB));

            this.fsWatcher = workspace.createFileSystemWatcher(
                globPath, !buildOnCreate, false, !buildOnDelete);
        }

        this.fsWatcher.onDidChange(debounce(this.run.bind(this), config.DEBOUNCE_WAIT_TIME));

        if (buildOnCreate) {
            this.fsWatcher.onDidCreate(debounce(this.run.bind(this), config.DEBOUNCE_WAIT_TIME));
        }

        if (buildOnDelete) {
            this.fsWatcher.onDidDelete(debounce(this.run.bind(this), config.DEBOUNCE_WAIT_TIME));
        }

        if (NodeTDD.getConfig<boolean>(config.RUN_ON_ACTIVATION)) {
            this.run();
        }
    }

    stop() {
        if (this.process) {
            this.process.kill();
        }
    }

    dispose() {
        this.stop();

        if (this.fsWatcher) {
            this.fsWatcher.dispose();
            this.fsWatcher = null;
        }
    }

    private get testCommand() {
        const scriptName = NodeTDD.getConfig<string>(config.TEST_SCRIPT).trim();

        return scriptName === 'test' ? 'npm test' : `npm run ${scriptName}`;
    }

    private async run() {
        if (this.process) {
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

        const scriptName = NodeTDD.getConfig<string>(config.TEST_SCRIPT).trim();

        if (!packageObj.scripts[scriptName]) {
            const selection = await window.showErrorMessage(
                messages.scriptNotFound(scriptName), messages.OPEN_PACKAGE_JSON).then();

            if (selection === messages.OPEN_PACKAGE_JSON) {
                workspace.openTextDocument(workspace.rootPath + '/package.json')
                    .then(textDocument => {

                        window.showTextDocument(textDocument);
                    });
            }

            return;
        }

        NodeTDD.getInstance().clearOutput();
        NodeTDD.getInstance().clearCoverage();
        NodeTDD.getInstance().hideCoverageStatusBar();

        NodeTDD.getInstance().setBuildStatusBar({
            ...messages.BUILDING,
            text: messages.BUILDING.text + ' '.repeat(4)
        });

        NodeTDD.getInstance().showBuildStatusBar();

        let count = 1;

        const interval = setInterval(() => {

            const dots = count++ % 4;
            const spaces = 4 - dots;

            NodeTDD.getInstance().setBuildStatusBar({
                text: messages.BUILDING.text + '.'.repeat(dots) + ' '.repeat(spaces)
            });
        }, config.BUILDING_ANIMATION_SPEED);

        this.process = exec(this.testCommand, { cwd: workspace.rootPath });

        const showCoverage = NodeTDD.getConfig<boolean>(config.SHOW_COVERAGE);

        this.process.stdout.on('data', (chunk) => {

            if (showCoverage) {
                if (chunk.toString().toLowerCase().includes('coverage')) {
                    NodeTDD.getInstance().setCoverage(parseCoverage(chunk));
                }
            }

            NodeTDD.getInstance().appendOutput(chunk.toString());
        });

        this.process.stderr.on('data', (chunk) => {

            NodeTDD.getInstance().appendOutput(chunk.toString());
        });

        this.process.on('close', (code, signal) => {

            clearInterval(interval);
            this.process = null;

            if (signal === 'SIGTERM') {
                NodeTDD.getInstance().setBuildStatusBar(messages.BUILD_STOPPED);
            }
            else if (code === 0) {
                NodeTDD.getInstance().setBuildStatusBar(messages.PASSING);
            }
            else if (code === 1) {
                NodeTDD.getInstance().setBuildStatusBar(messages.FAILING);
            }

            NodeTDD.getInstance().showInfoDialog(code);
            NodeTDD.getInstance().showCoverageStatusBar();
        });
    }
}
