import { exec } from 'child_process';
import { readFile } from 'fs';
import { StatusBarItem, window, Uri, workspace, FileSystemWatcher, OutputChannel, WorkspaceConfiguration, StatusBarAlignment } from 'vscode';

import { constants } from './constants';

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
        })
    })
}

export class TestRunner {
    private extensionConfig: WorkspaceConfiguration;
    private buildStatusBar: StatusBarItem;
    private extensionStatusBar: StatusBarItem;
    private fsWatcher: FileSystemWatcher;
    private outputChannel: OutputChannel;
    private running = false;
    private activated = false;
    private outputShown = false;

    constructor(config: WorkspaceConfiguration) {
        this.extensionConfig = config;

        this.extensionStatusBar = window.createStatusBarItem(StatusBarAlignment.Left, 2);
        this.buildStatusBar = window.createStatusBarItem(StatusBarAlignment.Left, 1);

        this.outputChannel = window.createOutputChannel(constants.OUTPUT_CHANNEL_NAME);

        this.activate();

        this.extensionStatusBar.text = 'TDD Mode';
        this.extensionStatusBar.show();

        this.watch();
    }

    get testCommand() {
        const scriptName = this.extensionConfig.get<string>('testScript').trim();

        return scriptName === 'test' ? 'npm test' : `npm run ${scriptName}`;
    }

    watch() {
        this.fsWatcher = workspace.createFileSystemWatcher(this.extensionConfig.get<string>('glob'));

        this.fsWatcher.onDidChange(debounce(this.run.bind(this)));

        if (this.extensionConfig.get('buildOnCreate')) {
            this.fsWatcher.onDidCreate(debounce(this.run.bind(this)));
        }

        if (this.extensionConfig.get('buildOnDelete')) {
            this.fsWatcher.onDidDelete(debounce(this.run.bind(this)));
        }
    }

    activate() {
        if (this.activated) {
            return false;
        }

        this.activated = true;
        this.watch();

        window.showInformationMessage('TDD mode activated. Any matching file saves will trigger a test run.');
    }

    deactivate() {
        if (!this.activated) {
            return false;
        }

        this.activated = false;
        this.fsWatcher.dispose();
        this.buildStatusBar.hide();
        window.showInformationMessage('TDD mode deactivated.');
    }

    async run(uri?: Uri) {
        if (!this.activated || this.running) {
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

        const scriptName = this.extensionConfig.get<string>('testScript').trim();

        if (!packageObj.scripts[scriptName]) {
            window.showErrorMessage(`npm script \`${scriptName}\` not found, no tests were run.`);

            return;
        }

        this.running = true;

        if (this.outputChannel) {
            this.outputChannel.clear();
        }

        this.buildStatusBar.text = constants.BUILDING_TEXT;
        this.buildStatusBar.color = constants.BUILDING_TEXT_COLOR;
        this.buildStatusBar.show();

        let count = 1;

        const interval = setInterval(() => {

            this.buildStatusBar.text = constants.BUILDING_TEXT + '.'.repeat(count++ % 4);
        }, constants.BUILDING_ANIMATION_SPEED);

        this.buildStatusBar.show();

        // const runner = exec(this.getTestScript(), { cwd: workspace.rootPath });
        // console.log(runner.stdio);

        // runner.stdout.on('data', () => {
        //     clearInterval(interval);

        //     this.running = false;

        //     this.statusBar.color = constants.PASSING_TEXT_COLOR;
        //     this.statusBar.text = constants.PASSING_TEXT;

        //     if (this.outputChannel) {
        //         this.outputChannel.hide();
        //     }
        // });

        // runner.stderr.on('data', async (stdout) => {
        //     console.log(arguments);
        //     this.statusBar.text = constants.FAILING_TEXT;
        //     this.statusBar.color = constants.FAILING_TEXT_COLOR;

        //     if (this.extensionConfig.get('verbose')) {
        //         const selection = await window.showErrorMessage(
        //             constants.FAILING_TEXT_MESSAGE, constants.FAILING_TEXT_OUTPUT_PROMPT)
        //             .then();

        //         if (selection === constants.FAILING_TEXT_OUTPUT_PROMPT) {
        //             if (!this.outputChannel) {
        //                 this.outputChannel = window.createOutputChannel(
        //                     constants.OUTPUT_CHANNEL_NAME);
        //             }

        //             this.outputChannel.append('Some errors');
        //             this.outputChannel.show();
        //         }

        //     }
        // })

        exec(this.testCommand, { cwd: workspace.rootPath }, async (error, stdout, stderr) => {

            clearInterval(interval);

            this.running = false;

            if (stderr) {
                this.buildStatusBar.text = constants.FAILING_TEXT;
                this.buildStatusBar.color = constants.FAILING_TEXT_COLOR;
                this.buildStatusBar.command = 'nodeTdd.showOutput'

                this.outputChannel.append(stdout);
                // this.outputChannel.show();

                // if (this.extensionConfig.get('verbose')) {
                //     const selection = await window.showErrorMessage(
                //         constants.FAILING_TEXT_MESSAGE, constants.FAILING_TEXT_OUTPUT_PROMPT)
                //         .then();

                //     if (selection === constants.FAILING_TEXT_OUTPUT_PROMPT) {
                //         if (!this.outputChannel) {
                //             this.outputChannel = window.createOutputChannel(
                //                 constants.OUTPUT_CHANNEL_NAME);
                //         }

                //         this.outputChannel.append(stdout);
                //         this.outputChannel.show();
                //     }
                // }
            }
            else if (stdout) {
                this.buildStatusBar.color = constants.PASSING_TEXT_COLOR;
                this.buildStatusBar.text = constants.PASSING_TEXT;
                this.buildStatusBar.command = 'nodeTdd.showOutput'
                this.outputChannel.append(stdout);

                // if (this.outputChannel) {
                //     this.outputChannel.hide();
                // }
            }
        });
    }

    toggleOutputChannel() {
        if (!this.outputShown) {
            this.outputChannel.show();
            this.outputShown = true;
        }
        else {
            this.outputChannel.hide();
            this.outputShown = false;
        }
    }

    dispose() {
        this.fsWatcher.dispose();
        this.buildStatusBar.dispose();
        if (this.outputChannel) {
            this.outputChannel.dispose();
        }
    }
}
