import { readFile } from 'fs';

export function readFileAsync(path: string) {
    return new Promise<string>((resolve, reject) => {

        readFile(path, 'utf8', (err, data) => {
            if (err) {
                return reject(err);
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
