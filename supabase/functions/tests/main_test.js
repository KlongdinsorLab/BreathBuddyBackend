//import { assertEquals } from "https://deno.land/std@0.204.0/assert/mod.ts";
//import { add } from "./main.ts";
//
//Deno.test(function addTest() {
//  assertEquals(add(2, 3), 5);
//});

import test from 'node:test';
import * as assert from 'node:assert';

test('synchronous passing test', (t) => {
  // This test passes because it does not throw an exception.
  assert.strictEqual(1, 1);
});