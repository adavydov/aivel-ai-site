import fs from "node:fs";
import path from "node:path";

const outputDir = path.resolve(process.argv[2] ?? "out");
if (!fs.existsSync(outputDir)) throw new Error(`Static export not found: ${outputDir}`);

let aliasesCreated = 0;

function addRscAliases(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    if (["_next", "brands", "images", "seo", "videos"].includes(entry.name)) continue;

    const nested = path.join(directory, entry.name);
    if (entry.name.startsWith("__next.")) {
      for (const child of fs.readdirSync(nested, { withFileTypes: true })) {
        if (!child.isFile()) continue;
        const source = path.join(nested, child.name);
        const alias = path.join(directory, `${entry.name}.${child.name}`);
        fs.copyFileSync(source, alias);
        aliasesCreated += 1;
      }
    }
    addRscAliases(nested);
  }
}

addRscAliases(outputDir);
fs.writeFileSync(path.join(outputDir, ".nojekyll"), "");

console.log(JSON.stringify({ outputDir, aliasesCreated, noJekyll: true }, null, 2));
