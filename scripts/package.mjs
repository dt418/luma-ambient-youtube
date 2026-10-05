import { zipSync } from "fflate";
import { readFile, writeFile, readdir } from "node:fs/promises";
import path from "node:path";
const root = path.resolve("outputs/youtube-ambient-v1"),
  files = {};
async function visit(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) await visit(p);
    else
      files[path.relative(root, p).replaceAll("\\", "/")] = new Uint8Array(
        await readFile(p),
      );
  }
}
await visit(root);
await writeFile("outputs/youtube-ambient-v1.zip", zipSync(files, { level: 6 }));
console.log("ZIP ready, manifest at root:", Object.keys(files).length, "files");
const sourceFiles = {};
async function sourceVisit(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) await sourceVisit(p);
    else
      sourceFiles[p.replaceAll("\\", "/")] = new Uint8Array(await readFile(p));
  }
}
for (const dir of ["src", "tests", "scripts", "extension", "docs"])
  await sourceVisit(dir);
for (const file of [
  "package.json",
  "package-lock.json",
  "tsconfig.json",
  ".gitignore",
  "README.md",
  "CHANGELOG.md",
])
  sourceFiles[file] = new Uint8Array(await readFile(file));
await writeFile(
  "outputs/youtube-ambient-v1-source.zip",
  zipSync(sourceFiles, { level: 6 }),
);
await writeFile("outputs/HUONG-DAN.md", await readFile("README.md"));
await writeFile("outputs/QA.md", await readFile("docs/QA.md"));
console.log("Source ZIP, Vietnamese guide and QA report ready.");
