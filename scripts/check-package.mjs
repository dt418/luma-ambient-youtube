import { readFile, access, readdir } from "node:fs/promises";
import assert from "node:assert/strict";
const root = "outputs/youtube-ambient-v1/";
const m = JSON.parse(await readFile(root + "manifest.json", "utf8"));
assert.equal(m.manifest_version, 3);
assert.deepEqual(m.permissions, ["storage"]);
assert.deepEqual(m.content_scripts[0].matches, ["https://www.youtube.com/*"]);
assert.ok(!m.background && !m.commands && !m.host_permissions);
for (const f of [
  m.action.default_popup,
  ...m.content_scripts[0].js,
  ...Object.values(m.icons),
  "popup.js",
  "popup.css",
])
  await access(root + f);
const js = (
  await Promise.all(
    ["content.js", "popup.js"].map((f) => readFile(root + f, "utf8")),
  )
).join("\n");
assert.ok(
  !/\bfetch\s*\(|XMLHttpRequest|https?:\/\//.test(js),
  "No external code or network requests in runtime bundles",
);
console.log(
  "Package checks passed: MV3, storage only, YouTube scope, assets present, no runtime network code.",
);
