# Changelog

All notable changes to the Blueprint Design System Dashboard are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added — 2026-04-24 · merged today count

- **New "Merged Today" export card** showing the daily merged-to-main MR count in the downloadable overview PNG.
- The card value is derived from `mergedTodayMergeRequests.length`, keeping the daily progress card separate from `recentlyMergedTickets`, which still drives component "New!" badges.
- Placed the smaller "Merged Today" card on the same export row as the component countdown.

### Added — 2026-04-21 · v5.17 Jira ticket links everywhere
- **New `jiraLink(ticket, extraStyle)` helper** near the `card()` wrapper. Generates `<a href="https://constructconnect.atlassian.net/browse/<TICKET>" target="_blank" rel="noopener">` with the primary color, open-in-new-tab semantics, and a "Open PS-XXX in Jira" tooltip. Returns empty string when `ticket` is falsy so it's safe to interpolate unconditionally.
- **`JIRA_BASE`** constant (`https://constructconnect.atlassian.net/browse/`) — update here if the Atlassian tenant ever changes.
- **Applied in 5 places:**
  1. **Components tab &rarr; All Components card** — ticket pill beside each component name is now a link
  2. **Overview tab &rarr; Fully Complete card** — tickets added next to every complete component (previously only the name + type pill)
  3. **Overview tab &rarr; Needs Attention card** — ticket appended next to the component name with a `·` separator
  4. **Pipeline tab &rarr; Latest Pipeline hero card** — commit_ref string auto-linkifies any `PS-\d+` pattern (regex replace at render)
  5. **Overview popovers (all 9)** — popover body auto-linkifies every `PS-\d+` pattern via regex replace at render time. Works for Total Components / Complete / In Progress / Planned / In NPM / Docs Only / Unplanned / Blocked / Active Consumers.
  6. **Gaps tab &rarr; Closed Gaps** — every ticket in the `closedBy` descriptions auto-linkifies
- **Regex-based auto-linkification** chosen for popovers and closedBy strings so authored text stays readable. Pattern `\b(PS-\d+)\b` is greedy over the canonical PS-nnnn format.
- Simple global replace (not lookbehind) chosen because the authored data never contains a pre-existing `<a href="...browse/PS-N">` wrapper — avoids the Safari &lt;16.4 lookbehind compat hazard.
- Badge: `v5.17 — Jira tickets now clickable everywhere`.

### Changed — 2026-04-21 · v5.16 Gaps tab refreshed
- **Certification Queue card renamed to "Unplanned Requests"** to match the `topMetrics` Unplanned card (4 items). Subtitle rewritten: "Requested or prototyped but not on the current roadmap — decide whether to promote, fold in, or deprecate."
- **Drawer removed from `remainingGaps`** — it's no longer a gap since the Drawer + DrawerModal merge (v5.13). The queue is now exactly the 4 Unplanned items: ComboBox/AutocompleteInput, Right Header Button Group, Inline Dropdown Field, modal-date-range.
- **Closed Gaps rewritten.** The old entries had multiple stale references that don't match current main:
  - "ProgressBar" still named the retired ProgressBarFill atom, and mis-classed ProgressBar as a molecule
  - "Drawer" referenced a non-existent "Push Drawer Container"
  - "FileUpload" implied all four pieces were done; only FileUploadButton is
  - "Toast" claimed Notifications was complete; it's still In Progress
  - "SearchBar" lumped complete molecules with Planned organism
  - "Pagination" claimed a "Pagination molecule" that doesn't exist on main
  - "Table" claimed full system closed; only 2 of 7 pieces shipped
  - "TopNav" listed generic "Header" which isn't a real component name on main
  Each entry now names the actual main-branch components and labels each as complete / In Progress / Planned. Alphabetized.
- **Subtitle on Closed Gaps rewritten** from "Specifications documented with CSS token files" (misleading — most aren't token-backed at gap-resolution time) to "System-level decisions on how each pattern is addressed — decomposition or rejection. Not every piece has shipped, but the approach is decided."
- **Gap Readiness card renamed** to "Post-Roadmap Readiness" and subtitle tightened to reflect what the 5 items actually are (Button Group, Button Container, CalendarGrid, Error Pages, Email Templates — all beyond the roadmap).
- Badge: `v5.16 — Gaps tab refreshed · 4 unplanned · 21 closed`.

### Changed — 2026-04-21 · v5.15 ProgressBarFill retired to N/A
- **ProgressBarFill (PS-3762) removed from the roadmap.** Its responsibility lives inside the `ProgressBar` atom; unlike Slider (where `SliderRail`/`SliderThumb`/`SliderTrack` are distinct reusable atoms composed by the Slider molecule), ProgressBar doesn't need a separate Fill atom — it was a PM bookkeeping artifact.
- **Counts updated:**
  - Total Components: 129 &rarr; **128**
  - Planned: 53 &rarr; **52** (Planned sub now reads "22 molecules + 24 organisms + 6 templates" — no more 1-atom-planned)
  - `atomicComparison.Atoms`: extracted 27/monorepo 26/handoff 1 &rarr; **26/26/0** (atoms tier now reads 100% done)
- **Complete popover:** the Discrepancies vs PM section reclassifies PBF as "Retired to *No longer applicable*" (previously said "Demoted to Planned"). Remaining active discrepancies: DropdownMenuContainer (PM-Complete &rarr; demoted to Planned) and Card (added, missing from PM).
- **Total Components popover:** ProgressBarFill now listed in the "No longer applicable" exclusion list.
- Badge: `v5.15 — ProgressBarFill retired · atoms 100% · 128 total`.

### Changed — 2026-04-21 · v5.14 Pipeline tab now shows GitLab CI/CD
- **Pipeline tab re-scoped** from "design &rarr; dev &rarr; NPM progression" to **GitLab CI/CD pipeline status** on `main`. Replaced `renderPipeline` entirely; previous design-pipeline visualization retired (that information remains on the Overview tab via `topMetrics` + the donut + the All Components card).
- **New data blocks** in the inline JS:
  - `gitlabProject` — project path, snapshot timestamp, branch watched
  - `gitlabLatestPipeline` — hero pipeline (#3437, 64cf60d8, success, 14m 05s) with inline stages array (lint, prepare, test, release, build, patch, push, deploy, rollback)
  - `gitlabRecentPipelines` — last 20 pipelines on `main`
- **Four new cards on the tab:**
  1. **Latest Pipeline on main** &mdash; big status badge, commit title + ticket, SHA, author, source, duration, relative time, deep link to GitLab
  2. **Stages — Pipeline #N** &mdash; vertical flow of the 9 stages with status icon, job count, proportional duration bar, duration label
  3. **Pipeline Health — last 20 on main** &mdash; 4-stat summary (success rate, avg duration, median duration, failed/canceled count), stacked distribution bar, per-trigger-source breakdown (push vs schedule vs web vs api)
  4. **Recent Pipelines (20)** &mdash; table: status icon, IID link, SHA, source, duration, relative time
- **Source:** GitLab MCP (`manage_pipeline list` + `get_pipeline_jobs`) against `constructconnect/product-development/unified-design/unified_design_system`, snapshot `2026-04-21T19:20Z`. Static — to refresh, re-fetch and replace the three data blocks.
- **Why not live:** dashboard is a browser-only static HTML file with no backend / no GitLab token, so a live query would require adding a Node sync script (pattern already exists for tokens — see `scripts/sync-tokens.mjs`). Can add one later if refresh cadence becomes painful.
- **Known pattern:** 3 scheduled pipelines (iid 3351/3354/3355 on SHA 62a59ad4) failed with short durations (&lt;5min). Likely a systematic scheduled-job issue on specific commits — worth a pass by CI owner.

### Changed — 2026-04-21 · v5.13 component deduplication
- **Drawer + DrawerModal merged to a single entry.** They are one component with two variants (same layout, different margin/setup), not two components. Drawer removed from `docsOnlyComponents`; DrawerModal (PS-2818) in `plannedComponents` gains a `note` field documenting that it unifies both variants. Counts affected:
  - Total Components: 130 &rarr; **129**
  - Docs Only: 1 &rarr; **0** (card now reads "None — Drawer merged into DrawerModal variant")
  - Organisms in `atomicComparison`: extracted 31 &rarr; 30, handoff 25 &rarr; 24
- **TableHeaderRow + TableHeader** are also one component with two variants (per product clarification). Both remain N/A on the current roadmap, so no data change was needed — but the "Total Components" popover now documents the semantic alongside the Drawer+DrawerModal merge.
- Badge updated to `v5.13 — Drawer merged into DrawerModal · 129 total`.
- Pipeline tab's "Implementation Completeness" subtitle updated to reference 129 roadmap components and note the merge.

### Added — 2026-04-21 · "All Components" card on Components tab
- Full 130-component inventory rendered as 4 alphabetized columns (Atoms 27 · Molecules 66 · Organisms 31 · Templates 6) with color-coded status dots (Complete/In Progress/Planned/Docs Only) and inline Jira tickets. Legend included.
- Data sourced by merging `completeComponents` + `partialComponents` + new `plannedComponents` (53 items) + `docsOnlyComponents` (1 — Drawer). Single scannable view replaces the need to cross-reference popovers.

### Changed — 2026-04-21 · v5.12 UDS main audit
- **Replaced PM-table counts with ground-truth inventory from `packages/components/src/` on UDS main (commit 64cf60d).** Counts now reflect what has `.tsx + _stories/ + _tests/` on disk, not what PM claims.
- **Three PM-vs-main discrepancies surfaced and reconciled:**
  - `ProgressBarFill` (PS-3762) — PM: Complete → Main: `atoms/ProgressBarFill/` contains only `progress-bar-fill-atom-documentation.md`, no `.tsx`. **Demoted to Planned.**
  - `DropdownMenuContainer` (PS-2617) — PM: Complete → Main: no folder exists at any atomic level. **Demoted to Planned.**
  - `Card` organism (PS-3669) — PM master omitted it → Main: `organisms/Card/` has full implementation since Mar 24, 2026. **Added to Complete.**
- **Folder names normalized to match main** (were PM-style labels before): `Toast` → `ToastMessage`, `NumberInput` → `NumberInputField`, `FormFieldMolecule` → `FormField`, `MultiselectItem` → `MultiSelectItem`, `Indicator Counter`/`Indicator Dot` → `IndicatorCounter`/`IndicatorDot`.
- **In Progress items cross-referenced against main:** 4 of 6 have docs-only folders (DropdownInput, ListItem, MenuHeader, TableRow); 2 have no folder at all (Notifications PS-3516, SkeletonLoading PS-3746). Issue notes updated to reflect this.
- **Recounted totals:**
  - Total Components: 129 → **130** (+1 Card; PBF and DMC stay on roadmap but moved to Planned)
  - Complete: 71 → **70** (26 atoms + 38 molecules + 6 organisms)
  - Planned: 51 → **53** (1 atom + 22 molecules + 24 organisms + 6 templates)
  - In Progress: 6 (unchanged)
  - In NPM Package: 71 → **70**
  - `atomicComparison`: Atoms 27/26/1 · Molecules 66/38/28 · Organisms 31/6/25 · Templates 6/0/6.
- **Pipeline "Implementation Completeness" subtitle** now reads 130 roadmap components and flags the 3 reconciled discrepancies.
- Complete popover now includes a "Discrepancies vs PM master list" section listing all three reconciliations.
- Source commit reference added to Total Components popover (`64cf60d`, Apr 21, 2026).

### Changed — 2026-04-21 · v5.11 UDS main sync
- **Resynced to UDS `main` branch audit (Apr 21, 2026).** 8 components advanced status:
  - **Molecules promoted from In Progress → Complete (7):** BreadcrumbTrail, FileUploadButton (PS-3713), FilterButton (PS-3098), InlineSearchField (PS-3730), ProgressBarField (PS-3763), SearchBar (PS-3731), TableRowContent (PS-3618).
  - **Organism added as Complete:** MenuContainer (PS-2448) — PM marks Complete despite "no implementation" note; flag for verification against `packages/components/src/`.
  - `UserAvatar` atom Jira ticket filled in (PS-2953).
- **Recounted topMetrics / deliveryStatus / atomicComparison:**
  - Total Components: 137 → 129 (roadmap = Complete + In Progress + Planned + Docs Only; excludes Specialty, Unplanned, N/A).
  - Complete: 63 → 71 (27 atoms + 39 molecules + 5 organisms).
  - In Progress: 10 → 6 (DropdownInput, ListItem, MenuHeader, Notifications, SkeletonLoading, TableRow).
  - Planned: 63 → 51 (21 molecules + 24 organisms + 6 templates).
  - In NPM Package: 63 → 71.
  - atomicComparison rebuilt: Atoms 27/27/0 · Molecules 66/39/27 · Organisms 30/5/25 · Templates 6/0/6.
- **Planned list rewritten** to reflect the new PM master: molecules drop items now Complete/In Progress (SearchBar, Notifications, etc.) and pick up TableFooter (PS-3621), TablePagination (PS-3621), HeaderLogoButton (PS-2376). Organisms pick up Filter Dropdown (PS-2826) and correctly list DrawerModal (PS-2818) as Planned.
- Growth card "April sprint" range extended to Apr 1 → Apr 21, 2026 (21 days, 33 → 71).
- Pipeline "Implementation Completeness" subtitle updated to reference 129 roadmap components (123 core + 6 templates).

### Changed
- **Data source pivoted to PM master tracking sheet.** Dashboard now reflects roadmap status (Complete / In Progress / Planned / Docs Only / Unplanned / N/A) rather than a pure code-on-main audit.
  - `topMetrics` — 9 cards relabeled: Total Components (137), Complete (63), In Progress (10), Planned (62), In NPM Package (63), Docs Only (1 — Drawer), Unplanned (4), Blocked (0), Active Consumers (3).
  - `deliveryStatus` donut — 4 segments: Complete / In Progress / Planned / Docs Only.
  - `completeComponents` — 63 entries (27 atoms + 32 molecules + 4 organisms) with Jira tickets preserved where provided.
  - `partialComponents` — 10 In Progress molecules with ticket numbers + issue notes.
  - `atomicComparison.extracted` now = "on active roadmap" (Complete + In Progress + Planned + Docs Only); `.monorepo` = Complete count per level; `.handoff` = remaining work.
  - `remainingGaps` — rewritten to the 5 truly open items: Drawer organism (docs-only), ComboBox/AutocompleteInput, Right Header Button Group, Inline Dropdown Field, modal-date-range.
  - `popoverData` — rewritten to match new card labels and source the full Planned/In Progress lists with tickets.
- Notable PM-vs-main discrepancies surfaced in the Complete popover:
  - `DropdownMenuContainer` (PS-2617) — Complete per PM but no `.tsx` on main yet.
  - `FormFieldMolecule` (PS-2873) — Complete per PM but no folder with that exact name on main (closest: `InputField` composition).
  - `SplitButton` (PS-2658) — Complete per PM but only `split-button-specification.md` on main.
  - `MenuContainer` organism — on main with `.tsx` but PM list says Planned/no implementation. Verify before consuming.
- **Library Growth card is now implementation-focused**, with two non-overlapping trajectories:
  - **Foundation build — Dec 2025 → end of March 2026** (top) — 2 → 33 implemented. Baselines count folders with `.tsx + _stories/ + _tests/` on UDS `main`: commit `f9b8070f` (2025-12-22, Button + Input only) → commit `0794924b` (2026-03-31, 15 atoms + 16 molecules + 2 organisms).
  - **April sprint — Apr 1 → Apr 17, 2026** (below, separated by a divider) — 33 → `completeComponents.length` (currently 63).
- Dropped the previous "Specs documented — Dec 2025 → Mar 2026" block from the card.
- By-atomic-level bars switched from `a.extracted` (specs) to `a.monorepo` (implemented), with dynamic max scaling and success-green fill.
- Removed unused derived variables (`pHasTokens`, `pGrowthBase`, `pGrowthIncrease`, `pGrowthPct`) from `renderOverview()`.

## [2.3.0] - 2026-04-17

### Added
- Dependency on `@unified_design_system/design-tokens` (pinned to `^2.4.0`); compiled `tokens.css` vendored at `assets/tokens.css`.
- `npm run sync:tokens` script (`scripts/sync-tokens.mjs`) with `mkdirSync` + `try/catch` + size-verification guards and differentiated install-vs-build error messages.
- `TOKENS` runtime map in the inline script — reads CSS custom properties via `getComputedStyle` so JS-driven chart and SVG colors resolve through the design-tokens package.
- Missing-token detection: if any `--color-*` resolves to `""`, a `role="alert"` banner is injected into the page with the list of missing keys and remediation steps. Prevents silent failures when the stylesheet 404s.
- Root-level `.gitignore` for `node_modules/`, `.claude/`, `.logs/`, editor scratch files.
- `package.json` fields: `"type": "module"`, `"engines": { "node": ">=18" }`.

### Changed
- In-palette hex literals (primary-500, primary-600, primary-700, neutral-100/200/300/400/500/600, status-success/warning/error, primary-100/200) replaced with `var(--color-*)` references in both the `<style>` block and inline-styled `innerHTML` template strings.
- `topMetrics`, `deliveryStatus`, `statusColor()`, and `priorityBadge()` now source their colors from the `TOKENS` object.

### Preserved
- Non-UDS hex literals kept where no UDS token matches — see README "Preserved non-UDS hex values" table for the full catalog (categorical accents, amber/mint/Material-blue callouts, surface greys, and the error-banner fallback that must not depend on CSS vars).

## [2.2.0] - 2026-04-17

### Changed
- Synced dashboard with UDS `main` branch inventory (commit `086aa656`).
- Production-Certified / In NPM Package: **24/25 → 63** — all components with code + stories + tests on `main`.
- `pipelineStats.docsOnly`: **0 → 35** — components scaffolded as `.md` but not yet built.
- `atomicComparison` monorepo column: Atoms **12→26**, Molecules **11→32**, Organisms **1→5**, Templates unchanged (0).
- `deliveryStatus` donut rebalanced: Prod-Certified **63** / DS-Complete **44** / Future Planned **2**.
- Systems table implementation counts updated across 18 systems; Loading / Accordion / Slider / Boolean Controls now fully `done`.
- Popovers for Production-Certified and In NPM Package rewritten with full component lists.
- Header + footer timestamps: March 28 → April 17, 2026.

### Source
- Direct audit of `origin/main` tree under `packages/components/src/{atoms,molecules,organisms}`.

## [2.1.0] - 2026-02-25 (Evening)

### Changed
- Updated with Vivian's latest audit (Feb 25, 2026).
- NPM package: 30 → 35 components (+5).
- Fully Shippable: 11 → 9 (CheckboxField and RadioButtonField moved to Partial).
- Partial: 6 → 8 components.
- Docs Only: 12 → 17 components.
- Missing Docs: 1 → 0 (Logo now documented).
- Organisms in monorepo: 1 → 4 (Accordion, AccordionHeader, MenuHeaderOrganism, RadioButtonGroup).
- Design Specs Ready: 27 → 22 components.
- Updated all documentation files.

## [2.0.0] - 2026-02-25 (Morning)

### Added
- Created the blueprint-dashboard project.
- Consolidated all data sources into a single repository.
- MCP readiness metric added to the dashboard.
- Comprehensive documentation for data sources and update procedures.

### Changed
- Clarified extraction vs. implementation inventories across the dashboard copy.

## [1.0.0] - 2026-02-23

### Added
- Initial dashboard created.
- 30 components in NPM package (per Vivian's monorepo audit).

[Unreleased]: https://github.com/STaylor-Figma/design-system-dashboard/compare/v2.3.0...HEAD
[2.3.0]: https://github.com/STaylor-Figma/design-system-dashboard/compare/v2.2.0...v2.3.0
[2.2.0]: https://github.com/STaylor-Figma/design-system-dashboard/compare/v2.1.0...v2.2.0
[2.1.0]: https://github.com/STaylor-Figma/design-system-dashboard/compare/v2.0.0...v2.1.0
[2.0.0]: https://github.com/STaylor-Figma/design-system-dashboard/compare/v1.0.0...v2.0.0
[1.0.0]: https://github.com/STaylor-Figma/design-system-dashboard/releases/tag/v1.0.0
