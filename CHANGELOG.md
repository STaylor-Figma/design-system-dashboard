# Changelog

All notable changes to the Blueprint Design System Dashboard are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed
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
