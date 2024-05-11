import test from 'node:test';
import * as assert from 'node:assert';

test('synchronous passing test 1', (t) => {
  // This test passes because it does not throw an exception.
  assert.strictEqual(1, 1);
});