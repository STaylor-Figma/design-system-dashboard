# Changelog

All notable changes to the Blueprint Design System Dashboard are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
