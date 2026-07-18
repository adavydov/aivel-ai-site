import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const dist = path.resolve(process.argv[2] ?? "dist");
const base = (process.argv[3] ?? "/aivel-ai-site").replace(/\/+$/, "");
const textExtensions = new Set([".html", ".xml", ".txt", ".css", ".js"]);

const shouldProcess = (file) => textExtensions.has(path.extname(file).toLowerCase());

const walk = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(file) : [file];
  }));
  return files.flat();
};

const prefixAbsolutePath = (value) => {
  if (
    value.startsWith("//") ||
    value.startsWith(`${base}/`) ||
    value.startsWith("/#") ||
    value === "/"
  ) {
    return value;
  }
  return `${base}${value}`;
};

const rewrite = (input) =>
  input
    .replace(/\b(href|src|poster|action)="(\/(?!\/)[^"]*)"/g, (_match, attr, value) => {
      return `${attr}="${prefixAbsolutePath(value)}"`;
    })
    .replace(/\bcontent="0;url=(\/(?!\/)[^"]*)"/g, (_match, value) => {
      return `content="0;url=${prefixAbsolutePath(value)}"`;
    })
    .replace(/url\((['"]?)(\/(?!\/)[^)'" ]+)\1\)/g, (_match, quote, value) => {
      const rewritten = prefixAbsolutePath(value);
      return `url(${quote}${rewritten}${quote})`;
    });

const files = (await walk(dist)).filter(shouldProcess);

for (const file of files) {
  const before = await readFile(file, "utf8");
  const after = rewrite(before);
  if (after !== before) await writeFile(file, after, "utf8");
}

const size = await stat(dist);
console.log(`Prepared ${files.length} files for GitHub Pages base ${base}.`);
