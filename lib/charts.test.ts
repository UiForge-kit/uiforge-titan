import assert from "node:assert/strict";
import { test } from "node:test";
import { niceMax, smoothPath } from "./charts.ts";

test("niceMax arrondit vers une graduation ronde", () => {
  assert.equal(niceMax(0), 1);
  assert.equal(niceMax(73), 100);
  assert.equal(niceMax(4200), 5000);
  assert.equal(niceMax(1800), 2000);
});

test("smoothPath démarre au premier point", () => {
  assert.equal(smoothPath([]), "");
  assert.ok(smoothPath([{ x: 0, y: 1 }, { x: 10, y: 5 }]).startsWith("M0,1 C"));
});
