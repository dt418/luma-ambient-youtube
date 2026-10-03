import { build } from "esbuild";
import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { generateIcons } from "./icons.mjs";
const out = path.resolve("outputs/youtube-ambient-v1");
await mkdir(out, { recursive: true });
await cp("extension", out, { recursive: true });
await generateIcons(path.join(out, "icons"));
export const rawCss = {
  name: "raw-css",
  setup(b) {
    b.onResolve({ filter: /\.css\?raw$/ }, (args) => ({
      path: path.resolve(args.resolveDir, args.path.replace(/\?raw$/, "")),
      namespace: "raw-css",
    }));
    b.onLoad({ filter: /.*/, namespace: "raw-css" }, async (args) => ({
      contents: await readFile(args.path, "utf8"),
      loader: "text",
    }));
  },
};
await build({
  entryPoints: { content: "src/content/index.ts", popup: "src/popup/index.ts" },
  outdir: out,
  bundle: true,
  format: "iife",
  target: "chrome120",
  minify: false,
  legalComments: "none",
  plugins: [rawCss],
});
console.log("Built unpacked extension:", out);
