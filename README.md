# Blueprint Design System Dashboard

**Central hub for Blueprint Design System status tracking and reporting**

## Purpose

This project consolidates all Blueprint Design System data sources into one location for:
- Status dashboard updates
- Progress tracking
- Gap analysis
- MCP readiness reporting
- Design-to-code workflow documentation

## Project Structure

```
blueprint-dashboard/
├── README.md                     # This file
├── CHANGELOG.md                  # Release history (Keep a Changelog format)
├── package.json                  # sync:tokens script
├── index.html                    # Dashboard (root copy)
├── assets/
│   └── tokens.css                # Vendored from @unified_design_system/design-tokens
├── dashboard/
│   └── blueprint-status.html    # Dashboard (mirror copy)
├── data/
│   ├── data-sources.md          # Master data inventory
│   ├── extraction-inventory.md  # Components extracted from Figma
│   ├── monorepo-audit.md        # Components in NPM package
│   └── mcp-readiness.md         # MCP/AI readiness status
├── docs/
│   ├── update-procedures.md      # How to update the dashboard
│   └── data-dictionary.md        # Definition of all metrics
└── scripts/
    └── sync-tokens.mjs           # Copies tokens.css from node_modules → assets/
```

## Data Sources

### 1. Design-System-Work Folder (Figma Extraction Inventory)
**Location:** `/Users/taylors/Desktop/ConstructConnect-Projects/Design-System-Work/`

- Components extracted from Figma with tokens and comprehensive documentation
- Status: Design specs + MCP-ready; the "Extracted" column of the dashboard's atomic comparison
- Files: Token CSS files + comprehensive documentation per component

### 2. UDS Monorepo (`unified_design_system` — `main` branch)
**Location:** Separate codebase at `packages/components/`

- Tracked via direct audit of `packages/components/src/{atoms,molecules,organisms}`
- Each component folder is classified as **Implemented** (has `.tsx` + `_stories/` + `_tests/`) or **Docs-only** (`*-documentation.md` but no `.tsx` yet)
- This distinction drives the dashboard's Production-Certified / In NPM Package counts

### 3. MCP Readiness Status
**Location:** `/Users/taylors/Desktop/ConstructConnect-Projects/Design-System-Work/`

- Every extracted component satisfies the 5 Figma MCP requirements
- Files: FIGMA-MCP-REQUIREMENTS-STATUS.md, FIGMA-MCP-DESIGN-TO-CODE-WORKFLOW.md

Current counts live in the JS data variables inside `index.html` / `dashboard/blueprint-status.html` and in the "Key Metrics" table below — those are the single source of truth; do not duplicate numbers elsewhere in this README.

## Key Metrics (Current)

| Metric | Value | Source |
|--------|-------|--------|
| **Total Components (Figma extraction)** | 107 | 103 core + 4 templates |
| **Implemented on UDS main** | 63 | Components with .tsx + stories + tests on main branch |
| **Docs-only on main** | 35 | Components scaffolded with .md documentation but no .tsx yet |
| **Not yet scaffolded in UDS** | 9 | In Figma extraction but no folder on main yet (mostly templates + some organisms) |
| **MCP Ready** | 107 | All extracted components documented |

### Implemented vs. Docs-only Breakdown (UDS main, Apr 17, 2026)

**Implemented (63):**
- Atoms (26): Badge, Breadcrumb, Checkbox, Divider, FieldMessage, HelperText, Icon, Indicator Counter, Indicator Dot, Input, Label, Logo, MenuToggleIcon, Overlay, ProgressBar, ProgressRing, RadioButton, SkipLink, SliderRail, SliderThumb, SliderTrack, TextArea, Toggle, Tooltip, UserAvatar, VisuallyHidden
- Molecules (32): AccordionHeader, BreadcrumbItem, BreadcrumbTrail, Button, ButtonIcon, CheckboxField, CircularIndicator, CircularProgress, DateInput, DropdownButton, DropdownItem, HeaderButton, InlineSearchField, InputField, LoadingMask, LogoLoader, ModalHeader, MultiSelectItem, NavSubmenuButton, NumberInputField, OverflowPanel, Pill, QuickSearchField, RadioButtonField, SearchField, Slider, SliderField, Tab, TableCell, TextAreaField, ToastMessage, ToggleField
- Organisms (5): Accordion, Card, MenuContainer, MenuHeaderOrganism, RadioButtonGroup

**Docs-only on main (35):**
- Atoms (1): ProgressBarFill
- Molecules (24): CalendarItemButton, DropdownInput, FileUploadAvatar, FileUploadButton, FileUploadField, FileUploadProgress, FilterButton, HeaderLogoButton, HeaderLogoTitle, ListItem, MenuContainer (molecule), MenuHeader, MenuToggleButton, MultiselectDropdownInput, NavMenuButton, PageHeader, ProgressBar (molecule), SearchBar, StepIndicator, TableActionsHeader, TableFooter, TableRow, TableRowContent, UsernameButton
- Organisms (10): BreadcrumbOrganism, DrawerModal, DropdownButton (organism), DropdownInput (organism), FilterMultiselectDropdown, MultiselectDropdownInputField, QuickSearch, SplitButton, TabGroup, Table

## Dashboard Updates

### To Update the Dashboard:

1. **Update data sources** in `data/` folder
2. **Edit JavaScript variables** in `dashboard/blueprint-status.html` (lines ~200-350)
3. **Test locally** by opening HTML file in browser
4. **Document changes** in version history

### Key Data Variables:

```javascript
var topMetrics = [...]           // 5 metric cards at top
var deliveryStatus = [...]       // Donut chart (Complete/Partial/Docs/Missing)
var completeComponents = [...]   // List of 9 complete
var partialComponents = [...]    // List of 8 partial
var atomicComparison = [...]     // Bar chart (Extracted/Monorepo/Handoff)
var systems = [...]              // Component systems table
var remainingGaps = [...]        // Open gaps table
var closedGaps = [...]           // Resolved gaps
var popoverData = {...}          // Info popovers
```

## Quick Reference

### Component Status Categories

The dashboard classifies every component into one of two states relative to UDS `main`:

**Implemented** — has all of:
- `.tsx` code on `main`
- `_stories/*.stories.tsx`
- `_tests/*.test.tsx`
- Design tokens in `packages/design-tokens`

**Docs-only** — has a `*-documentation.md` file scaffolding the spec, but no `.tsx` yet. Ready to be built next.

Live counts are in the "Key Metrics" table above — see that section for the authoritative numbers as of the last dashboard refresh.

## Related Documentation

**In Design-System-Work:**
- [Component Extraction Inventory](../Design-System-Work/design-system-tokens/COMPONENT-EXTRACTION-INVENTORY.md)
- [Figma MCP Requirements Status](../Design-System-Work/FIGMA-MCP-REQUIREMENTS-STATUS.md)
- [Figma MCP Workflow](../Design-System-Work/FIGMA-MCP-DESIGN-TO-CODE-WORKFLOW.md)
- [Gap Analysis (Feb 12)](../Design-System-Work/SESSION-LOG-2026-02-12-figma-component-inventory.md)

**In This Project:**
- [Data Sources Inventory](data/data-sources.md)
- [Update Procedures](docs/update-procedures.md)
- [Data Dictionary](docs/data-dictionary.md)

## Design Tokens

The dashboard consumes colors from the `@unified_design_system/design-tokens` package. The compiled `tokens.css` is vendored at `assets/tokens.css` so the dashboard remains a zero-dep, openable-in-browser artifact. A small `TOKENS` object in the inline script reads the CSS variables via `getComputedStyle` so JS-driven chart/SVG colors stay in sync with the package.

### Refreshing tokens

```bash
# once, to install the source package (private Cloudsmith registry)
npm install

# whenever UDS design-tokens publishes a new version
npm run sync:tokens
```

### Preserved non-UDS hex values

Where a color has a direct match in the UDS palette (primary, neutral, status-success/warning/error), it is routed through `var(--color-*)`. Where it doesn't, the hex is left as a literal and documented here:

| Category | Hex | Used for |
|---|---|---|
| Categorical accents | `#00838F` (teal), `#6B3FA0` (purple) | "Has Tokens" / "Ready to Build" metric borders, "Future Planned" donut segment |
| Amber callouts | `#FFF3CD`, `#FFE082`, `#FFF8E1`, `#FFFDF5`, `#8B6914` | Growth highlight bar, "human experts" callout, partial-component rows |
| Mint / green tints | `#E8F5E9`, `#C8E6C9`, `#F0FAF0` | MCP-readiness card, closed-gaps rows, done-state tint backgrounds |
| Material blue | `#E3F2FD`, `#01579B`, `#90CAF9` | Behavioral-specs explainer callout |
| Surface greys | `#F8F9FA`, `#FAFAFA` | Page background, alternating table rows, card backdrops |
| Error-banner fallback | `#b70900`, `#fff` | TOKENS-failure banner (intentionally hex so it works even when the stylesheet fails to load) |

These are the single source of truth for the dashboard's off-palette colors. When the UDS palette grows to cover any of them, migrate them over and prune this table.

## Version History

See [CHANGELOG.md](CHANGELOG.md) for the full release history (v1.0.0 through v2.3.0). Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); add new entries under `[Unreleased]` and promote them to a dated version on release.

## Usage

### View Dashboard:
```bash
# Open in browser
open /Users/taylors/Desktop/ConstructConnect-Projects/blueprint-dashboard/dashboard/blueprint-status.html
```

### Update Data:
1. Edit data sources in `data/` folder
2. Update JavaScript variables in HTML file
3. Refresh browser to see changes

### Share Dashboard:
- Dashboard is a single self-contained HTML file
- Can be opened directly in any browser
- No server or dependencies required
- Easy to email or share via Slack

## Contact

**Maintained by:** Taylor S.
**Last Updated:** April 17, 2026 (v2.3)
**Next Review:** As needed when Vivian provides updates
