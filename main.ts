// news-image-20261121 — "THE WORLD TODAY" front page for 21 November 2026.
// Copies the pre-rendered entry.png into the make.fun output directory.
// Node 22, standard library only. Deterministic: byte-for-byte identical output.

import { copyFileSync, existsSync, mkdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const SOURCE = join(HERE, "entry.png");
const OUT_DIR = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? "/output");
const DEST = join(OUT_DIR, "entry.png");
const MAX_BYTES = 1024 * 1024;

if (!existsSync(SOURCE)) {
  console.error(`missing source image: ${SOURCE}`);
  process.exit(1);
}

const size = statSync(SOURCE).size;
if (size > MAX_BYTES) {
  console.error(`entry.png is ${size} bytes, over the ${MAX_BYTES} byte limit`);
  process.exit(1);
}

mkdirSync(OUT_DIR, { recursive: true });
copyFileSync(SOURCE, DEST);

// Verify the copy landed intact before reporting success.
const copied = statSync(DEST).size;
if (copied !== size) {
  console.error(`copy mismatch: wrote ${copied} bytes, expected ${size}`);
  process.exit(1);
}
console.log(`wrote ${DEST} (${size} bytes, verified ${copied} bytes)`);
