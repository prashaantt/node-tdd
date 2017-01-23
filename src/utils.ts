import { readFile } from 'fs';
const Parser = require('tap-parser');

export function readFileAsync(path: string) {
    return new Promise<string>((resolve, reject) => {

        readFile(path, 'utf8', (err, data) => {
            if (err) {
                return reject(err.message);
            }

            return resolve(data);
        });
    });
}

export function parseCoverage(chunk: string | Buffer) {
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

export enum Status {
    PASSING,
    FAILING
}

export interface Report {
    reporter: string;
    stdout: string;
}

interface Result {
    pass: number;
    count: number;
}

export async function getMessage(status: Status, minimal?: boolean, report?: Report) {
    let text = '';
    let tooltip = '';
    const stats = await getStats(report);

    if (minimal) {
        if (report && stats) {
            text = stats;
        }
        else {
            text = status === Status.PASSING ? '$(check)' : '$(alert)';
        }
        tooltip = status === Status.PASSING ? 'Build passing' : 'Build failing';
    }
    else {
        text = status === Status.PASSING ? '$(check)' : '$(alert)';
        if (stats) {
            text += ' ' + stats;
        }
        else {
            text += status === Status.PASSING ? ' Passing' : ' Failing';
        }
        tooltip = 'Toggle output';
    }

    return {
        text,
        tooltip
    };
}

async function getStats(report?: Report) {
    if (report) {
        const result = await parseReport(report);
        if (result) {
            return `${result.pass}/${result.count}`;
        }
    }
}

function parseReport(report: Report) {
    if (report.reporter === 'tap') {
        return new Promise<Result>(resolve => {
            const parser = new Parser();
            parser.on('complete', function (results: any) {
                resolve({
                    pass: results.pass,
                    count: results.count
                });
            });
            parser.end(report.stdout);
        });
    }
}
