import * as assert from 'assert';
import { exec, ChildProcess } from 'child_process';

import { parseCoverage, readFileAsync } from '../src/utils';

suite("parseCoverage", () => {

    test('correctly returns expected coverage', () => {

        const coverageReport = `
Other stuff
=============================== Coverage summary ===============================
Statements   : 94.55% ( 52/55 )
Branches     : 100% ( 6/6 )
Functions    : 85% ( 17/20 )
Lines        : 94.44% ( 51/54 )
================================================================================
Extra stuff`;
        assert.equal(parseCoverage(coverageReport), 93.50);
    });
});
