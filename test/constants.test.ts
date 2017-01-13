import * as assert from 'assert';

import { messages, config } from '../src/constants';

suite("Constants", () => {

    test("return correct coverage", () => {

        const message = messages.coverage(84, null);
        assert.deepEqual(message, {
            text: '$(dashboard) 84%',
            tooltip: 'Test coverage',
            color: 'inherit'
        });
    });

    test("return correct coverage with threshold", () => {

        const message = messages.coverage(84, 100);
        assert.deepEqual(message, {
            text: '$(dashboard) 84%',
            tooltip: 'Test coverage',
            color: config.FAILING_COLOUR
        });
    });

    test("correctly return scriptNotFound message", () => {

        const message = messages.scriptNotFound('test');
        assert.equal(message, 'Node TDD: npm script `test` was not found');
    });
});
