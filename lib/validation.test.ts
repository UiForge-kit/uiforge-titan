import assert from "node:assert/strict";
import { test } from "node:test";
import { isEmail, isHttpsUrl } from "./validation.ts";

test("isEmail", () => {
  assert.equal(isEmail("a@b.co"), true);
  assert.equal(isEmail("a@b"), false);
  assert.equal(isEmail("a b@c.com"), false);
});

test("isHttpsUrl", () => {
  assert.equal(isHttpsUrl("https://a.example.com/x"), true);
  assert.equal(isHttpsUrl("http://a.example.com"), false);
  assert.equal(isHttpsUrl("javascript:alert(1)"), false);
});
