import { existsSync, statSync } from "node:fs";
import { dirname, extname, resolve as resolvePath } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const projectRoot = resolvePath(dirname(fileURLToPath(import.meta.url)), "..");
const srcRoot = resolvePath(projectRoot, "src");

const assetExtensions = new Set([".gif", ".ico", ".jpeg", ".jpg", ".mp3", ".png", ".svg", ".webp"]);

function isFile(path) {
  return existsSync(path) && statSync(path).isFile();
}

function resolveExistingPath(rawPath) {
  const extension = extname(rawPath);
  const candidates =
    extension === ".js"
      ? [rawPath.replace(/\.js$/, ".ts"), rawPath]
      : extension
        ? [rawPath]
        : [
            `${rawPath}.ts`,
            `${rawPath}.tsx`,
            `${rawPath}.mts`,
            `${rawPath}.js`,
            `${rawPath}.mjs`,
            `${rawPath}/index.ts`,
            `${rawPath}/index.tsx`,
            `${rawPath}/index.js`,
          ];

  return candidates.find(isFile);
}

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("@/")) {
    const resolvedPath = resolveExistingPath(resolvePath(srcRoot, specifier.slice(2)));

    if (resolvedPath) {
      return {
        url: pathToFileURL(resolvedPath).href,
        shortCircuit: true,
      };
    }
  }

  if (specifier.startsWith(".") && context.parentURL?.startsWith("file:")) {
    const resolvedPath = resolveExistingPath(
      resolvePath(dirname(fileURLToPath(context.parentURL)), specifier),
    );

    if (resolvedPath) {
      return {
        url: pathToFileURL(resolvedPath).href,
        shortCircuit: true,
      };
    }
  }

  return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
  if (url.startsWith("file:") && assetExtensions.has(extname(fileURLToPath(url)))) {
    return {
      format: "module",
      source: 'export default "";',
      shortCircuit: true,
    };
  }

  return nextLoad(url, context);
}
