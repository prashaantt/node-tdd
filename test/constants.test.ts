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

    test('return correct failing message', async () => {

        const message = await messages.failing(false);
        assert.deepEqual(message, {
            text: '$(alert) Failing',
            color: config.FAILING_COLOUR,
            tooltip: 'Toggle output',
            command: commands.TOGGLE_OUTPUT
        });
    });

    test('return correct failing message in minimal mode', async () => {

        const message = await messages.failing(true);
        assert.deepEqual(message, {
            text: '$(alert)',
            color: config.FAILING_COLOUR,
            tooltip: 'Build failing',
            command: commands.TOGGLE_OUTPUT
        });
    });

    test('return correct failing message for tap reporter', async () => {

        const report = {
            reporter: 'tap',
            stdout: `TAP version 13
# beep
ok 1 should be equal
ok 2 should be equivalent
# boop
ok 3 should be equal
not ok 4 should be truthy
  ---
    operator: ok
    expected: true
    actual:   false
  ...

1..4
# tests 4
# pass  4
# fail  1`
        };

        const message = await messages.failing(false, report);
        assert.deepEqual(message, {
            text: '$(alert) 3/4',
            color: config.FAILING_COLOUR,
            tooltip: 'Toggle output',
            command: commands.TOGGLE_OUTPUT
        });
    });

    test('return correct failing message for tap reporter in minimal mode', async () => {

        const report = {
            reporter: 'tap',
            stdout: `TAP version 13
# beep
ok 1 should be equal
ok 2 should be equivalent
# boop
ok 3 should be equal
not ok 4 should be truthy
  ---
    operator: ok
    expected: true
    actual:   false
  ...

1..4
# tests 4
# pass  4
# fail  1`
        };

        const message = await messages.failing(true, report);
        assert.deepEqual(message, {
            text: '$(alert)',
            color: config.FAILING_COLOUR,
            tooltip: 'Build failing (3/4)',
            command: commands.TOGGLE_OUTPUT
        });
    });

    test('return correct passing message', async () => {

        const message = await messages.passing(false);
        assert.deepEqual(message, {
            text: '$(check) Passing',
            color: config.PASSING_COLOUR,
            tooltip: 'Toggle output',
            command: commands.TOGGLE_OUTPUT
        });
    });

    test('return correct passing message in minimal mode', async () => {

        const message = await messages.passing(true);
        assert.deepEqual(message, {
            text: '$(check)',
            color: config.PASSING_COLOUR,
            tooltip: 'Build passing',
            command: commands.TOGGLE_OUTPUT
        });
    });

    test('return correct passing message for tap reporter', async () => {

        const report = {
            reporter: 'tap',
            stdout: `TAP version 13
# beep
ok 1 should be equal
ok 2 should be equivalent
# boop
ok 3 should be equal
ok 4 (unnamed assert)

1..4
# tests 4
# pass  4

# ok`
        };

        const message = await messages.passing(false, report);
        assert.deepEqual(message, {
            text: '$(check) 4/4',
            color: config.PASSING_COLOUR,
            tooltip: 'Toggle output',
            command: commands.TOGGLE_OUTPUT
        });
    });

    test('return correct passing message for tap reporter in minimal mode', async () => {

        const report = {
            reporter: 'tap',
            stdout: `TAP version 13
# beep
ok 1 should be equal
ok 2 should be equivalent
# boop
ok 3 should be equal
ok 4 (unnamed assert)

1..4
# tests 4
# pass  4

# ok`
        };

        const message = await messages.passing(true, report);
        assert.deepEqual(message, {
            text: '$(check)',
            color: config.PASSING_COLOUR,
            tooltip: 'Build passing (4/4)',
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
