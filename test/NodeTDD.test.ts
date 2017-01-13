import * as assert from 'assert';

import { NodeTDD } from '../src/NodeTDD';
import { config } from '../src/constants';

suite("The extension manager NodeTDD", () => {

    test('correctly returns a singleton instance', () => {
        assert.equal(NodeTDD.getInstance(), NodeTDD.getInstance());
    });

    test('correctly reads the config', () => {
        assert.equal(NodeTDD.getConfig(config.ACTIVATE_ON_STARTUP),
            config.ACTIVATE_ON_STARTUP.defaultValue);
    });
});
