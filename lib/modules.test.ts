import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";
import { PRO_MODULE_IDS } from "../config/module-ids.ts";
import { findMissingEntries, findUnregistered } from "./modules.ts";

const fromRoot = (path: string) => new URL(`../${path}`, import.meta.url);

test("every module has an entry point", () => {
  assert.deepEqual(findMissingEntries(PRO_MODULE_IDS, (path) => existsSync(fromRoot(path))), []);
});

test("every module is imported by the registry", () => {
  const source = readFileSync(fromRoot("config/modules.ts"), "utf8");
  assert.deepEqual(findUnregistered(PRO_MODULE_IDS, source), []);
});

test("helpers report what is missing", () => {
  assert.deepEqual(findMissingEntries(["a", "b"], (path) => path.includes("/a/")), ["b"]);
  assert.deepEqual(findUnregistered(["a", "b"], 'import "@/modules/a"'), ["b"]);
});
