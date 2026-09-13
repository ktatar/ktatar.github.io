import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const contentDir = path.join(rootDir, 'src/content');
const publicDir = path.join(rootDir, 'public');
const outputDir = path.join(publicDir, 'content-images');

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await walk(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }

  return files;
}

function sanitizeSegment(value) {
  return value
    .replace(/\\/g, '/')
    .split('/')
    .filter(Boolean)
    .map((segment) => segment.replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, ''))
    .filter(Boolean)
    .join('/');
}

function isLocalAsset(reference) {
  if (!reference) return false;
  const normalized = reference.trim();
  return !/^(?:[a-z]+:)?\/\//i.test(normalized) && !normalized.startsWith('data:') && !normalized.startsWith('#') && !normalized.startsWith('/');
}

function isPublicAsset(reference) {
  if (!reference) return false;
  const normalized = reference.trim();
  return normalized.startsWith('/');
}

function normalizeReference(reference) {
  return reference.replace(/\\/g, '/').replace(/^\.\//, '');
}

async function copyAsset(markdownFile, reference) {
  const normalizedReference = normalizeReference(reference);
  const resolvedSource = path.resolve(path.dirname(markdownFile), normalizedReference);

  let sourceStat;
  try {
    sourceStat = await fs.stat(resolvedSource);
  } catch {
    return null;
  }

  const relativeToContent = path.relative(contentDir, markdownFile);
  const markdownStem = path.basename(markdownFile, '.md');
  const relativeFolder = path.dirname(relativeToContent);
  const outputFolder = path.join(outputDir, sanitizeSegment(relativeFolder), sanitizeSegment(markdownStem));
  const destination = path.join(outputFolder, path.basename(resolvedSource));

  try {
    const destStat = await fs.stat(destination);
    if (destStat.size !== sourceStat.size) {
      await fs.mkdir(path.dirname(destination), { recursive: true });
      await fs.copyFile(resolvedSource, destination);
    }
  } catch {
    await fs.mkdir(path.dirname(destination), { recursive: true });
    await fs.copyFile(resolvedSource, destination);
  }

  const publicPath = path.posix.join('/content-images', sanitizeSegment(relativeFolder), sanitizeSegment(markdownStem), path.basename(resolvedSource));
  return publicPath;
}

async function processMarkdownFile(markdownFile) {
  const originalContent = await fs.readFile(markdownFile, 'utf8');
  let updatedContent = originalContent;

  const markdownImageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  const markdownMatches = [...updatedContent.matchAll(markdownImageRegex)];
  for (const match of markdownMatches) {
    const fullMatch = match[0];
    const src = match[2]?.trim();
    if (!src || (!isLocalAsset(src) && !isPublicAsset(src))) continue;
    if (isPublicAsset(src)) continue;
    const publicPath = await copyAsset(markdownFile, src);
    if (!publicPath) continue;
    updatedContent = updatedContent.replace(fullMatch, fullMatch.replace(src, publicPath));
  }

  const htmlImageRegex = /<img\b([^>]*?)\bsrc=["']([^"']+)["']([^>]*)>/g;
  const htmlMatches = [...updatedContent.matchAll(htmlImageRegex)];
  for (const match of htmlMatches) {
    const fullMatch = match[0];
    const src = match[2]?.trim();
    if (!src || (!isLocalAsset(src) && !isPublicAsset(src))) continue;
    if (isPublicAsset(src)) continue;
    const publicPath = await copyAsset(markdownFile, src);
    if (!publicPath) continue;
    updatedContent = updatedContent.replace(fullMatch, fullMatch.replace(src, publicPath));
  }

  return updatedContent;
}

async function main() {
  await fs.mkdir(outputDir, { recursive: true });
  const files = await walk(contentDir);

  for (const file of files) {
    const originalContent = await fs.readFile(file, 'utf8');
    const updatedContent = await processMarkdownFile(file);
    if (updatedContent !== originalContent) {
      await fs.writeFile(file, updatedContent, 'utf8');
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
