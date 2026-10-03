import { build } from "esbuild";
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
const rawCss = {
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
  entryPoints: ["tests/fixtures/preview.ts"],
  outfile: "work/preview/preview.js",
  bundle: true,
  format: "iife",
  plugins: [rawCss],
});
createServer(async (req, res) => {
  try {
    const js = req.url === "/preview.js";
    const file = js ? "work/preview/preview.js" : "tests/fixtures/preview.html";
    res.setHeader(
      "Content-Type",
      js ? "text/javascript" : "text/html; charset=utf-8",
    );
    res.end(await readFile(file));
  } catch {
    res.statusCode = 500;
    res.end("Preview failed");
  }
}).listen(4781, "127.0.0.1", () =>
  console.log("Luma preview http://127.0.0.1:4781/watch?v=demo"),
);
