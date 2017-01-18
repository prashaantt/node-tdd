import * as assert from 'assert';

import { messages, config, commands } from '../src/constants';

suite('Constants', () => {

    test('return correct coverage', () => {

        const message = messages.coverage(84, null, false);
        assert.deepEqual(message, {
            text: '$(dashboard) 84%',
            tooltip: 'Test coverage',
            color: 'inherit',
            command: commands.TOGGLE_OUTPUT
        });
    });

    test('return correct coverage in minimal mode', () => {

        const message = messages.coverage(84, null, true);
        assert.deepEqual(message, {
            text: '84',
            tooltip: 'Test coverage',
            color: 'inherit',
            command: commands.TOGGLE_OUTPUT
        });
    });

    test('return correct coverage with threshold', () => {

        const message = messages.coverage(84, 100, false);
        assert.deepEqual(message, {
            text: '$(dashboard) 84%',
            tooltip: 'Test coverage',
            color: config.FAILING_COLOUR,
            command: commands.TOGGLE_OUTPUT
        });
    });

    test('return correct coverage with threshold in minimal mode', () => {

        const message = messages.coverage(84, 100, true);
        assert.deepEqual(message, {
            text: '84',
            tooltip: 'Test coverage',
            color: config.FAILING_COLOUR,
            command: commands.TOGGLE_OUTPUT
        });
    });

    test('return correct scriptNotFound message', () => {

        const message = messages.scriptNotFound('test');
        assert.equal(message, 'Node TDD: The npm script `test` was not found');
    });

    test('return correct failing message', () => {

        const message = messages.failing(false);
        assert.deepEqual(message, {
            text: '$(alert) Failing',
            color: config.FAILING_COLOUR,
            tooltip: 'Toggle output',
            command: commands.TOGGLE_OUTPUT
        });
    });

    test('return correct failing message in minimal mode', () => {

        const message = messages.failing(true);
        assert.deepEqual(message, {
            text: '$(alert)',
            color: config.FAILING_COLOUR,
            tooltip: 'Build failing',
            command: commands.TOGGLE_OUTPUT
        });
    });

    test('return correct passing message', () => {

        const message = messages.passing(false);
        assert.deepEqual(message, {
            text: '$(check) Passing',
            color: config.PASSING_COLOUR,
            tooltip: 'Toggle output',
            command: commands.TOGGLE_OUTPUT
        });
    });

    test('return correct passing message in minimal mode', () => {

        const message = messages.passing(true);
        assert.deepEqual(message, {
            text: '$(check)',
            color: config.PASSING_COLOUR,
            tooltip: 'Build passing',
            command: commands.TOGGLE_OUTPUT
        });
    });

    test('return correct buildStopped message', () => {

        const message = messages.buildStopped(false);
        assert.deepEqual(message, {
            text: 'Build stopped',
            color: 'inherit',
            tooltip: '',
            command: ''
        });
    });

    test('return correct buildStopped message in minimal mode', () => {

        const message = messages.buildStopped(true);
        assert.deepEqual(message, {
            text: '$(stop)',
            color: 'inherit',
            tooltip: 'Build stopped',
            command: ''
        });
    });
});
