// tools/scan-stub-type-imports.mjs
import { promises as fs } from "node:fs";
import path from "node:path";

const WEB_ROOT = "apps/web";
const SRC_REL = "src";
const projectRoot = process.cwd();
const srcDir = path.join(projectRoot, WEB_ROOT, SRC_REL);
const stubsDir = path.join(srcDir, "types");
const stubFile = path.join(stubsDir, "ambient-stubs.d.ts");

// 解析 "@/xxx" 模組實際路徑
function resolveAlias(p) {
  if (p.startsWith("@/")) return path.join(srcDir, p.slice(2));
  return null;
}

async function walk(dir, out = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) await walk(full, out);
    else if (
      (full.endsWith(".ts") || full.endsWith(".tsx")) &&
      !full.endsWith(".d.ts")
    ) out.push(full);
  }
  return out;
}

async function fileExists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const files = await walk(srcDir);
  const pattern =
    /import\s+type\s*\{([^}]+)\}\s*from\s*["']([^"']+)["']\s*;?/g;

  /** @type {Map<string, Set<string>>} */
  const need = new Map();

  for (const f of files) {
    const content = await fs.readFile(f, "utf8");
    for (const m of content.matchAll(pattern)) {
      const types = m[1]
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const mod = m[2].trim();

      const resolved = resolveAlias(mod);
      if (!resolved) continue;

      const candidates = [
        `${resolved}.ts`,
        `${resolved}.tsx`,
        path.join(resolved, "index.ts"),
        path.join(resolved, "index.tsx"),
      ];

      let ok = false;
      for (const c of candidates) {
        if (await fileExists(c)) {
          ok = true;
          break;
        }
      }
      if (!ok) {
        if (!need.has(mod)) need.set(mod, new Set());
        const set = need.get(mod);
        types.forEach((t) => set.add(t));
      }
    }
  }

  if (need.size === 0) {
    console.log("No missing type-only modules. Nothing to do.");
    return;
  }

  await fs.mkdir(stubsDir, { recursive: true });
  let buf = "// Auto-generated type stubs\n";

  for (const [mod, types] of need.entries()) {
    buf += `declare module "${mod}" {\n`;
    for (const t of types) {
      if (/^[A-Za-z_]\w*$/.test(t)) buf += `  export type ${t} = any;\n`;
      else buf += `  export const __stub: any;\n`;
    }
    buf += "}\n\n";
  }

  await fs.appendFile(stubFile, buf, { encoding: "utf8" });
  console.log(`Updated stub file: ${stubFile}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
