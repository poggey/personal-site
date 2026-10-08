/**
 * Copy checker. Enforces the CLAUDE.md copy rules that a machine can check:
 * no em dashes, no en dashes used as dashes, no banned words.
 *
 * In .ts/.tsx files only user-facing text is checked (JSX text, string and
 * template literals), so code comments such as {/* DRAFT *\/} never trip it.
 * MDX and Markdown files are checked line by line in full.
 *
 * Usage: node scripts/check-copy.ts [paths...]  (defaults to the site's copy)
 */
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { extname, join, relative } from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";

export type Hit = { file: string; line: number; column: number; rule: string; match: string };

type Rule = { name: string; pattern: RegExp };

const LETTER_OR_DIGIT = String.raw`[\p{L}\p{N}]`;

export const RULES: Rule[] = [
  { name: "em dash", pattern: /—/gu },
  // An en dash with a letter or digit on each side (spaces allowed) is being used as a dash,
  // including number ranges such as 2019–2021, which read as "2019 to 2021".
  {
    name: "en dash",
    pattern: new RegExp(String.raw`(?<=${LETTER_OR_DIGIT}\s*)–(?=\s*${LETTER_OR_DIGIT})`, "gu"),
  },
  { name: "banned word: delve", pattern: /\bdelv(?:e|es|ed|ing)\b/giu },
  { name: "banned word: leverage", pattern: /\bleverag(?:e|es|ed|ing)\b/giu },
  { name: "banned word: seamless", pattern: /\bseamless(?:ly)?\b/giu },
  { name: "banned word: unlock", pattern: /\bunlock(?:s|ed|ing)?\b/giu },
  { name: "banned word: elevate", pattern: /\belevat(?:e|es|ed|ing)\b/giu },
  { name: "banned word: cutting-edge", pattern: /\bcutting[\s-]edge\b/giu },
  { name: "banned word: journey", pattern: /\bjourney(?:s|ed|ing)?\b/giu },
  { name: "banned phrase: in today's", pattern: /\bin today['’]s\b/giu },
  { name: "banned word: synergy", pattern: /\bsynerg(?:y|ies|istic)\b/giu },
  // "robust" is allowed only in the econometric sense.
  { name: "banned word: robust", pattern: /\brobust(?:ly|ness)?\b(?!\s+standard\s+errors?\b)/giu },
];

const DEFAULT_TARGETS = ["src/content", "src/components", "src/app", "README.md"];
const SOURCE_EXTENSIONS = new Set([".ts", ".tsx"]);
const PROSE_EXTENSIONS = new Set([".md", ".mdx"]);

/** Every rule match in a piece of text, as character offsets into that text. */
export function findInText(text: string): { index: number; rule: string; match: string }[] {
  const found: { index: number; rule: string; match: string }[] = [];
  for (const { name, pattern } of RULES) {
    for (const m of text.matchAll(pattern)) {
      found.push({ index: m.index, rule: name, match: m[0] });
    }
  }
  return found;
}

/** The [start, end) offsets of user-facing text in a TS/TSX file. */
function copySpans(sourceFile: ts.SourceFile): [number, number][] {
  const spans: [number, number][] = [];
  const visit = (node: ts.Node) => {
    // Module paths are code, not copy.
    if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) return;
    if (
      ts.isJsxText(node) ||
      ts.isStringLiteral(node) ||
      ts.isNoSubstitutionTemplateLiteral(node) ||
      ts.isTemplateHead(node) ||
      ts.isTemplateMiddle(node) ||
      ts.isTemplateTail(node)
    ) {
      spans.push([node.getStart(sourceFile), node.getEnd()]);
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  return spans;
}

/** Converts a character offset to a 1-based line and column. */
function position(text: string, offset: number): { line: number; column: number } {
  const before = text.slice(0, offset);
  const line = before.split("\n").length;
  const column = offset - before.lastIndexOf("\n");
  return { line, column };
}

export function checkFile(file: string, text = readFileSync(file, "utf8")): Hit[] {
  const ext = extname(file);
  let spans: [number, number][];
  if (SOURCE_EXTENSIONS.has(ext)) {
    const kind = ext === ".tsx" ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
    const sourceFile = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, kind);
    spans = copySpans(sourceFile);
  } else if (PROSE_EXTENSIONS.has(ext)) {
    spans = [[0, text.length]];
  } else {
    return [];
  }

  const hits: Hit[] = [];
  for (const [start, end] of spans) {
    for (const f of findInText(text.slice(start, end))) {
      hits.push({ file, ...position(text, start + f.index), rule: f.rule, match: f.match });
    }
  }
  return hits.sort((a, b) => a.line - b.line || a.column - b.column);
}

/** Expands files and folders into the list of checkable files. */
export function collectFiles(targets: string[]): string[] {
  const files: string[] = [];
  for (const target of targets) {
    if (!existsSync(target)) continue;
    if (statSync(target).isFile()) {
      files.push(target);
      continue;
    }
    for (const entry of readdirSync(target, { recursive: true, encoding: "utf8" })) {
      const path = join(target, entry);
      const ext = extname(path);
      if ((SOURCE_EXTENSIONS.has(ext) || PROSE_EXTENSIONS.has(ext)) && statSync(path).isFile()) {
        files.push(path);
      }
    }
  }
  return files.sort();
}

export function run(targets: string[]): number {
  const hits = collectFiles(targets).flatMap((file) => checkFile(file));
  for (const h of hits) {
    console.log(
      `${relative(process.cwd(), h.file)}:${h.line}:${h.column}  ${h.rule}  "${h.match}"`,
    );
  }
  if (hits.length > 0) {
    console.log(`\ncheck:copy found ${hits.length} problem${hits.length === 1 ? "" : "s"}.`);
    return 1;
  }
  console.log("check:copy passed.");
  return 0;
}

// Run only when called from the command line, not when imported by tests.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = process.argv.slice(2);
  process.exitCode = run(args.length > 0 ? args : DEFAULT_TARGETS);
}
