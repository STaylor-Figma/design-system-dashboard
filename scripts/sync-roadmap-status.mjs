#!/usr/bin/env node

import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

const DASHBOARD_ROOT = process.cwd();
const HTML_TARGETS = [
  path.join(DASHBOARD_ROOT, 'index.html'),
  path.join(DASHBOARD_ROOT, 'dashboard', 'blueprint-status.html'),
];

const LAYER_TO_TYPE = {
  atoms: 'Atom',
  molecules: 'Molecule',
  organisms: 'Organism',
  templates: 'Template',
};

function normalizeLayer(layer) {
  if (layer === 'template') return 'templates';
  return layer;
}

function orderByLayerThenName(a, b) {
  const layerOrder = ['atoms', 'molecules', 'organisms', 'templates'];
  const layerDelta = layerOrder.indexOf(normalizeLayer(a.layer)) - layerOrder.indexOf(normalizeLayer(b.layer));
  if (layerDelta !== 0) return layerDelta;
  return a.name.localeCompare(b.name);
}

async function listWorktreeStatusCandidates(worktreesRoot) {
  const candidates = [];
  let entries = [];
  try {
    entries = await readdir(worktreesRoot, { withFileTypes: true });
  } catch {
    return candidates;
  }

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const candidate = path.join(worktreesRoot, entry.name, 'scripts', 'component-status.json');
    try {
      const fileStat = await stat(candidate);
      if (fileStat.isFile()) {
        candidates.push({ path: candidate, mtimeMs: fileStat.mtimeMs });
      }
    } catch {
      // Ignore missing status files for non-UDS worktrees.
    }
  }

  return candidates;
}

async function resolveStatusPath() {
  if (process.env.UDS_COMPONENT_STATUS_PATH) {
    return path.resolve(process.env.UDS_COMPONENT_STATUS_PATH);
  }

  const directCandidate = path.resolve(DASHBOARD_ROOT, '..', 'unified_design_system', 'scripts', 'component-status.json');
  const candidates = [];

  try {
    const directStat = await stat(directCandidate);
    if (directStat.isFile()) {
      candidates.push({ path: directCandidate, mtimeMs: directStat.mtimeMs });
    }
  } catch {
    // Ignore missing direct clone.
  }

  const worktreeRoot = path.resolve(DASHBOARD_ROOT, '..', 'uds-worktrees');
  const worktreeCandidates = await listWorktreeStatusCandidates(worktreeRoot);
  candidates.push(...worktreeCandidates);

  if (candidates.length === 0) {
    throw new Error(
      'Could not find component-status.json. Set UDS_COMPONENT_STATUS_PATH to an explicit file path.',
    );
  }

  candidates.sort((a, b) => b.mtimeMs - a.mtimeMs);
  return candidates[0].path;
}

function toJsObject(item) {
  const fields = [`name:"${item.name}"`, `type:"${LAYER_TO_TYPE[item.layer] ?? LAYER_TO_TYPE[normalizeLayer(item.layer)] ?? 'Component'}"`];
  if (item.ticket) {
    fields.push(`ticket:"${item.ticket}"`);
  }
  return `  {${fields.join(', ')}}`;
}

function toJsArray(variableName, items) {
  if (items.length === 0) {
    return `var ${variableName} = [];`;
  }
  const body = items.map(toJsObject).join(',\n');
  return `var ${variableName} = [\n${body}\n];`;
}

function buildInProgressSub(inProgress) {
  if (inProgress.length === 0) return 'No active development';
  const names = inProgress.slice(0, 3).map((item) => item.name).join(', ');
  return inProgress.length > 3 ? `${names} +${inProgress.length - 3} more` : names;
}

function buildTopMetricsBlock(statusData, breakdown) {
  const complete = breakdown.implemented.length;
  const atoms = breakdown.implemented.filter((item) => normalizeLayer(item.layer) === 'atoms').length;
  const molecules = breakdown.implemented.filter((item) => normalizeLayer(item.layer) === 'molecules').length;
  const organisms = breakdown.implemented.filter((item) => normalizeLayer(item.layer) === 'organisms').length;
  const templates = breakdown.implemented.filter((item) => normalizeLayer(item.layer) === 'templates').length;

  const total = statusData.totals?.total ?? complete + breakdown.inProgress.length + breakdown.planned.length + breakdown.docsOnly.length;
  const inProgressCount = breakdown.inProgress.length;
  const inProgressSub = buildInProgressSub(breakdown.inProgress);

  return `var topMetrics = [
  {label:"Total Components",value:${total},sub:"Active roadmap - Complete + In Progress + Planned + Docs Only",color:TOKENS.primary500},
  {label:"Complete",        value:${complete}, sub:"${atoms} atoms + ${molecules} molecules + ${organisms} organisms + ${templates} templates",color:TOKENS.success},
  {label:"In Progress",     value:${inProgressCount},  sub:"${inProgressSub}",color:TOKENS.warning},
  {label:"In NPM Package",  value:70, sub:"70 published · !232 merged Apr 29 · @components 5.0.0 released · verify count against Cloudsmith",color:TOKENS.primary500},
  {label:"Blocked",         value:0,  sub:"No current blockers",color:TOKENS.primary600},
  {label:"Active Consumers",value:5,  sub:"Payment Portal, UCMS, Automation Support active · GCV4, Identity Platform in progress",color:TOKENS.primary600}
];`;
}

function buildDeliveryStatusBlock(breakdown) {
  return `var deliveryStatus = [
  {name:"Complete",    value:${breakdown.implemented.length}, color:TOKENS.success},
  {name:"In Progress", value:${breakdown.inProgress.length},  color:TOKENS.warning},
  {name:"Planned",     value:${breakdown.planned.length}, color:"#00838F"},
  {name:"Docs Only",   value:${breakdown.docsOnly.length},  color:"#6B3FA0"}
];`;
}

function replaceVarBlock(content, variableName, replacement) {
  const pattern = new RegExp(`var ${variableName} = \\[[\\s\\S]*?\\];`);
  if (!pattern.test(content)) {
    throw new Error(`Unable to find block for ${variableName}`);
  }
  return content.replace(pattern, replacement);
}

function replacePopoverTotal(content, statusData, breakdown) {
  const total = statusData.totals?.total ?? breakdown.implemented.length + breakdown.inProgress.length + breakdown.planned.length + breakdown.docsOnly.length;
  const atoms = breakdown.implemented.filter((item) => normalizeLayer(item.layer) === 'atoms').length;
  const molecules = breakdown.implemented.filter((item) => normalizeLayer(item.layer) === 'molecules').length;
  const organisms = breakdown.implemented.filter((item) => normalizeLayer(item.layer) === 'organisms').length;
  const templates = breakdown.implemented.filter((item) => normalizeLayer(item.layer) === 'templates').length;

  let updated = content;
  updated = updated.replace(
    /"Total Components":\s*"[^"]*"/,
    `"Total Components": "${total} components are on the active roadmap. Breakdown: Complete ${breakdown.implemented.length}, In Progress ${breakdown.inProgress.length}, Planned ${breakdown.planned.length}, Docs Only ${breakdown.docsOnly.length}."`,
  );
  updated = updated.replace(
    /"Complete":\s*"[^"]*"/,
    `"Complete": "${breakdown.implemented.length} complete components in the dashboard inventory (${atoms} atoms, ${molecules} molecules, ${organisms} organisms, ${templates} templates)."`,
  );
  updated = updated.replace(
    /"In Progress":\s*"[^"]*"/,
    `"In Progress": "${breakdown.inProgress.length} components are currently in active development."`,
  );
  return updated;
}

function canonicalizeLegacyText(content) {
  return content
    .replace(/\bFormLayout\b/g, 'FormTemplate')
    .replace(/\bDatePickerTemplate\b/g, 'DatePickerModal')
    .replace(
      /FormTemplate retained only as compatibility alias/g,
      'FormLayout retained only as compatibility alias',
    );
}

async function main() {
  const statusPath = await resolveStatusPath();
  const raw = await readFile(statusPath, 'utf8');
  const statusData = JSON.parse(raw);

  const components = Array.isArray(statusData.components) ? statusData.components : [];
  const breakdown = {
    implemented: components.filter((item) => item.status === 'implemented').sort(orderByLayerThenName),
    inProgress: components.filter((item) => item.status === 'inProgress').sort(orderByLayerThenName),
    planned: components.filter((item) => item.status === 'planned').sort(orderByLayerThenName),
    docsOnly: components.filter((item) => item.status === 'docsOnly').sort(orderByLayerThenName),
  };

  for (const filePath of HTML_TARGETS) {
    const content = await readFile(filePath, 'utf8');
    let updated = content;
    updated = replaceVarBlock(updated, 'topMetrics', buildTopMetricsBlock(statusData, breakdown));
    updated = replaceVarBlock(updated, 'deliveryStatus', buildDeliveryStatusBlock(breakdown));
    updated = replaceVarBlock(updated, 'completeComponents', toJsArray('completeComponents', breakdown.implemented));
    updated = replaceVarBlock(updated, 'partialComponents', toJsArray('partialComponents', breakdown.inProgress));
    updated = replaceVarBlock(updated, 'plannedComponents', toJsArray('plannedComponents', breakdown.planned));
    updated = replaceVarBlock(updated, 'docsOnlyComponents', toJsArray('docsOnlyComponents', breakdown.docsOnly));
    updated = replacePopoverTotal(updated, statusData, breakdown);
    updated = canonicalizeLegacyText(updated);

    await writeFile(filePath, updated, 'utf8');
  }

  console.log(`Synced dashboard roadmap data from: ${statusPath}`);
  console.log(
    `Totals -> Complete ${breakdown.implemented.length}, In Progress ${breakdown.inProgress.length}, Planned ${breakdown.planned.length}, Docs Only ${breakdown.docsOnly.length}`,
  );
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
