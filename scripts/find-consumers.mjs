/**
 * find-consumers.mjs
 *
 * Discovers every repo on the ConstructConnect self-hosted GitLab instance that
 * depends on the design system packages (published to Cloudsmith, not the GitLab
 * Package Registry -- so the only signal we have is dependency declarations in
 * each consumer's package.json), then maps each repo to the owning team via
 * CODEOWNERS.
 *
 * Outputs:
 *   ./out/consumers.json  - machine-readable records
 *   ./out/consumers.md    - human summary grouped by owning team
 *
 * Usage:
 *   export GITLAB_URL=https://gitlab.example.com
 *   export GITLAB_TOKEN=<your personal access token>
 *   export GITLAB_GROUP=constructconnect        # optional, scopes search
 *   export PACKAGE_NAMES=@unified_design_system/components,@unified_design_system/design-tokens
 *   node scripts/find-consumers.mjs
 *
 * Required env:
 *   GITLAB_URL   - base URL of the GitLab instance
 *   GITLAB_TOKEN - PAT with read_api + read_repository
 *
 * Optional env:
 *   PACKAGE_NAMES - comma-separated; defaults to the two design-system packages
 *   GITLAB_GROUP  - group path to scope search to (recommended for large instances)
 *
 * Requires Node >= 18 (relies on global fetch).
 */

import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(HERE, '..', 'out');

const DEFAULT_PACKAGES = [
  '@unified_design_system/components',
  '@unified_design_system/design-tokens',
];

const CODEOWNERS_LOCATIONS = ['CODEOWNERS', '.gitlab/CODEOWNERS', 'docs/CODEOWNERS'];

const MAX_RETRIES = 3;
const RETRY_BASE_MS = 1000;

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing required env var: ${name}`);
    process.exit(1);
  }
  return value.replace(/\/+$/, '');
}

const GITLAB_URL = requireEnv('GITLAB_URL');
const GITLAB_TOKEN = requireEnv('GITLAB_TOKEN');
const GITLAB_GROUP = process.env.GITLAB_GROUP?.trim() || null;
const PACKAGE_NAMES = (process.env.PACKAGE_NAMES?.trim() || DEFAULT_PACKAGES.join(','))
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const API = `${GITLAB_URL}/api/v4`;
const HEADERS = {
  'PRIVATE-TOKEN': GITLAB_TOKEN,
  Accept: 'application/json',
};

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function gitlabFetch(path, { query = {}, raw = false, attempt = 1 } = {}) {
  const url = new URL(path.startsWith('http') ? path : `${API}${path}`);
  for (const [k, v] of Object.entries(query)) {
    if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
  }

  let res;
  try {
    res = await fetch(url, { headers: HEADERS });
  } catch (err) {
    if (attempt >= MAX_RETRIES) throw err;
    const wait = RETRY_BASE_MS * 2 ** (attempt - 1);
    console.warn(`[retry] network error on ${url.pathname} (${err.message}); waiting ${wait}ms`);
    await sleep(wait);
    return gitlabFetch(path, { query, raw, attempt: attempt + 1 });
  }

  if (res.status === 429) {
    const retryAfter = Number(res.headers.get('retry-after')) || 5;
    console.warn(`[rate-limit] 429 on ${url.pathname}; sleeping ${retryAfter}s`);
    await sleep(retryAfter * 1000);
    return gitlabFetch(path, { query, raw, attempt });
  }

  if (res.status === 404) return { status: 404, body: null, headers: res.headers };

  if (!res.ok) {
    if (res.status >= 500 && attempt < MAX_RETRIES) {
      const wait = RETRY_BASE_MS * 2 ** (attempt - 1);
      console.warn(`[retry] ${res.status} on ${url.pathname}; waiting ${wait}ms`);
      await sleep(wait);
      return gitlabFetch(path, { query, raw, attempt: attempt + 1 });
    }
    const text = await res.text().catch(() => '');
    throw new Error(`GitLab ${res.status} ${res.statusText} on ${url.pathname}: ${text.slice(0, 300)}`);
  }

  const body = raw ? await res.text() : await res.json();
  return { status: res.status, body, headers: res.headers };
}

async function searchBlobs(packageName) {
  const results = [];
  const searchExpr = `"${packageName}" filename:package.json`;
  const scope = GITLAB_GROUP ? `/groups/${encodeURIComponent(GITLAB_GROUP)}/search` : '/search';

  let page = 1;
  const perPage = 50;
  while (true) {
    const { body, headers } = await gitlabFetch(scope, {
      query: { scope: 'blobs', search: searchExpr, per_page: perPage, page },
    });
    if (!Array.isArray(body) || body.length === 0) break;
    for (const hit of body) results.push(hit);

    const nextPage = headers.get('x-next-page');
    if (!nextPage) break;
    page = Number(nextPage);
  }
  return results;
}

async function getProject(projectId) {
  const { body } = await gitlabFetch(`/projects/${projectId}`);
  return body;
}

async function getFileRaw(projectId, filePath, ref) {
  const encoded = encodeURIComponent(filePath);
  const { status, body } = await gitlabFetch(
    `/projects/${projectId}/repository/files/${encoded}/raw`,
    { query: { ref }, raw: true },
  );
  if (status === 404) return null;
  return body;
}

function extractDepRanges(pkgJson, targetPackages) {
  const buckets = ['dependencies', 'devDependencies', 'peerDependencies'];
  const out = {};
  for (const bucket of buckets) {
    const deps = pkgJson[bucket];
    if (!deps || typeof deps !== 'object') continue;
    for (const name of targetPackages) {
      if (typeof deps[name] === 'string' && !(name in out)) {
        out[name] = deps[name];
      }
    }
  }
  return out;
}

function pathMatchesCodeownersRule(rulePath, target) {
  // Only count rules that cover package.json at the repo root.
  if (rulePath === '*' || rulePath === '**') return true;
  const normalized = rulePath.replace(/^\.\//, '').replace(/^\//, '');
  return normalized === target;
}

function parseCodeowners(text) {
  const rules = [];
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.replace(/#.*$/, '').trim();
    if (!line) continue;
    if (line.startsWith('[') && line.endsWith(']')) continue; // section header
    const parts = line.split(/\s+/);
    if (parts.length < 2) continue;
    const [pattern, ...owners] = parts;
    rules.push({ pattern, owners });
  }
  return rules;
}

function pickOwners(rules) {
  for (const rule of rules) {
    if (pathMatchesCodeownersRule(rule.pattern, 'package.json')) {
      return rule.owners;
    }
  }
  return [];
}

async function fetchCodeowners(projectId, ref) {
  for (const location of CODEOWNERS_LOCATIONS) {
    try {
      const text = await getFileRaw(projectId, location, ref);
      if (text) return { location, text };
    } catch (err) {
      console.warn(`[warn] fetching ${location} for project ${projectId}: ${err.message}`);
    }
  }
  return null;
}

async function analyzeProject(projectPath, candidatePaths) {
  let project;
  try {
    project = await getProject(encodeURIComponent(projectPath));
  } catch (err) {
    console.warn(`[skip] cannot load project ${projectPath}: ${err.message}`);
    return null;
  }
  const defaultBranch = project.default_branch;
  if (!defaultBranch) {
    console.warn(`[skip] ${projectPath} has no default branch`);
    return null;
  }

  const dependencies = {};
  const packageJsonPaths = [...new Set(candidatePaths.length ? candidatePaths : ['package.json'])];

  let anyParsed = false;
  for (const pkgPath of packageJsonPaths) {
    let raw;
    try {
      raw = await getFileRaw(project.id, pkgPath, defaultBranch);
    } catch (err) {
      console.warn(`[warn] fetching ${pkgPath} in ${projectPath}: ${err.message}`);
      continue;
    }
    if (!raw) continue;

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      console.warn(`[warn] cannot parse ${pkgPath} in ${projectPath}: ${err.message}`);
      continue;
    }
    anyParsed = true;
    const ranges = extractDepRanges(parsed, PACKAGE_NAMES);
    for (const [k, v] of Object.entries(ranges)) {
      if (!(k in dependencies)) dependencies[k] = v;
    }
  }

  if (!anyParsed) {
    console.warn(`[skip] no parseable package.json found in ${projectPath}`);
    return null;
  }
  if (Object.keys(dependencies).length === 0) {
    // Keyword hit but the package name did not appear in a standard deps
    // bucket (e.g. comment, resolution override). Skip.
    return null;
  }

  const codeowners = await fetchCodeowners(project.id, defaultBranch);
  let owners = [];
  if (codeowners) {
    owners = pickOwners(parseCodeowners(codeowners.text));
  }
  if (owners.length === 0) owners = ['unknown'];

  return {
    project: projectPath,
    defaultBranch,
    dependencies,
    owners,
  };
}

function groupByOwner(records) {
  const byOwner = new Map();
  for (const rec of records) {
    for (const owner of rec.owners) {
      if (!byOwner.has(owner)) byOwner.set(owner, []);
      byOwner.get(owner).push(rec);
    }
  }
  return byOwner;
}

function renderMarkdown(records) {
  const byOwner = groupByOwner(records);
  const teamCount = byOwner.size;
  const lines = [];
  lines.push(`# Design System Consumers`);
  lines.push('');
  lines.push(`${records.length} repos across ${teamCount} teams consuming the design system.`);
  lines.push('');
  lines.push(`Packages tracked: ${PACKAGE_NAMES.map((p) => `\`${p}\``).join(', ')}`);
  lines.push('');

  const sortedOwners = [...byOwner.keys()].sort((a, b) => {
    if (a === 'unknown') return 1;
    if (b === 'unknown') return -1;
    return a.localeCompare(b);
  });

  for (const owner of sortedOwners) {
    const repos = byOwner.get(owner).slice().sort((a, b) => a.project.localeCompare(b.project));
    lines.push(`## ${owner}`);
    lines.push('');
    for (const rec of repos) {
      const deps = Object.entries(rec.dependencies)
        .map(([pkg, range]) => `\`${pkg}@${range}\``)
        .join(', ');
      lines.push(`- **${rec.project}** (${rec.defaultBranch}) - ${deps}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

async function main() {
  console.log(`GitLab: ${GITLAB_URL}`);
  console.log(`Packages: ${PACKAGE_NAMES.join(', ')}`);
  if (GITLAB_GROUP) console.log(`Scoped to group: ${GITLAB_GROUP}`);

  const projectHits = new Map();

  for (const pkg of PACKAGE_NAMES) {
    console.log(`\nSearching for ${pkg}...`);
    let hits;
    try {
      hits = await searchBlobs(pkg);
    } catch (err) {
      console.error(`[error] search failed for ${pkg}: ${err.message}`);
      continue;
    }
    console.log(`  ${hits.length} blob hits`);

    for (const hit of hits) {
      const projectPath = hit.project_path || hit.path_with_namespace;
      const filePath = hit.path || hit.filename || 'package.json';
      if (!projectPath) continue;
      if (!filePath.endsWith('package.json')) continue;
      if (!projectHits.has(projectPath)) projectHits.set(projectPath, new Set());
      projectHits.get(projectPath).add(filePath);
    }
  }

  console.log(`\n${projectHits.size} unique projects to inspect`);

  const records = [];
  let i = 0;
  for (const [projectPath, paths] of projectHits) {
    i += 1;
    process.stdout.write(`[${i}/${projectHits.size}] ${projectPath} ... `);
    try {
      const rec = await analyzeProject(projectPath, [...paths]);
      if (rec) {
        records.push(rec);
        console.log(`ok (${rec.owners.join(', ')})`);
      } else {
        console.log('skipped');
      }
    } catch (err) {
      console.log(`error: ${err.message}`);
    }
  }

  records.sort((a, b) => a.project.localeCompare(b.project));

  await mkdir(OUT_DIR, { recursive: true });
  const jsonPath = join(OUT_DIR, 'consumers.json');
  const mdPath = join(OUT_DIR, 'consumers.md');
  await writeFile(jsonPath, JSON.stringify(records, null, 2) + '\n', 'utf8');
  await writeFile(mdPath, renderMarkdown(records), 'utf8');

  console.log(`\nWrote ${records.length} records`);
  console.log(`  ${jsonPath}`);
  console.log(`  ${mdPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
