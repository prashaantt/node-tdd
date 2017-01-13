import { exec, ChildProcess } from 'child_process';
import { readFile } from 'fs';
import { resolve } from 'path';
import { window, workspace, FileSystemWatcher } from 'vscode';

import { NodeTDD } from './NodeTDD';
import { constants, config } from './constants';

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

        this.fsWatcher.onDidChange(debounce(this.run.bind(this)));

        if (buildOnCreate) {
            this.fsWatcher.onDidCreate(debounce(this.run.bind(this)));
        }

        if (buildOnDelete) {
            this.fsWatcher.onDidDelete(debounce(this.run.bind(this)));
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
                constants.scriptNotFound(scriptName), constants.OPEN_PACKAGE_JSON).then();

            if (selection === constants.OPEN_PACKAGE_JSON) {
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
            ...constants.BUILDING_MESSAGE,
            text: constants.BUILDING_MESSAGE.text + ' '.repeat(4)
        });

        NodeTDD.getInstance().showBuildStatusBar();

        let count = 1;

        const interval = setInterval(() => {

            const dots = count++ % 4;
            const spaces = 4 - dots;

            NodeTDD.getInstance().setBuildStatusBar({
                text: constants.BUILDING_MESSAGE.text + '.'.repeat(dots) + ' '.repeat(spaces)
            });
        }, constants.BUILDING_ANIMATION_SPEED);

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
                NodeTDD.getInstance().setBuildStatusBar(constants.BUILD_STOPPED_MESSAGE);
            }
            else if (code === 0) {
                NodeTDD.getInstance().setBuildStatusBar(constants.PASSING_MESSAGE);
            }
            else if (code === 1) {
                NodeTDD.getInstance().setBuildStatusBar(constants.FAILING_MESSAGE);
            }

            NodeTDD.getInstance().showInfoDialog(code);
            NodeTDD.getInstance().showCoverageStatusBar();
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

function parseCoverage(chunk: string | Buffer) {
    const coverageReports = chunk.toString().split('\n').filter(line => line.includes('%'));

    if (coverageReports.length > 0) {
        const percentages = coverageReports.map(report => {

            const match = report.match(/(\d*\.?\d*?(?=%))/);

            if (match) {
                return parseFloat(match[0]);
            }

            return 0;
        });

        const average = percentages.reduce((a, b) => a + b) / percentages.length;

        return parseFloat(average.toFixed(2));
    }
}
