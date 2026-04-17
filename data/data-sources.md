# Blueprint Dashboard - Data Sources Inventory

**Last Updated:** April 17, 2026 (Synced with UDS `main` branch)

## Overview

This document tracks all data sources that feed into the Blueprint Design System Dashboard. It clarifies the distinction between **extracted** (design specs ready) and **implemented** (in NPM package) components.

---

## Source 1: Design-System-Work Extraction Inventory

**Location:** `/Users/taylors/Desktop/ConstructConnect-Projects/Design-System-Work/design-system-tokens/COMPONENT-EXTRACTION-INVENTORY.md`

**What it tracks:** Components extracted from Figma with tokens and documentation

### Summary Statistics
- **Total Components:** 60+
- **Atoms:** 15 (40% complete with token counts)
- **Molecules:** 45+ (38% complete with token counts)
- **Organisms:** 11+ (14% complete with token counts)

### Status Categories
- **Complete with token counts:** 23+ components
- **Legacy format (needs update):** 29 components
- **Needs detailed extraction:** 12+ organisms

### Key Insights
- Token extraction started November 2025
- Major updates: January-February 2026
- Most recent: February 21, 2026
- Tracks: Token counts, primitive mappings, validation results

### Files Location
```
/Users/taylors/Desktop/ConstructConnect-Projects/Design-System-Work/design-system-tokens/
├── 3-components/
│   ├── atoms/ (24 CSS token files)
│   ├── molecules/ (18 CSS token files)
│   ├── organisms/ (6 CSS token files)
│   └── documentation/ (27 markdown files with behavioral specs)
```

---

## Source 2: Monorepo NPM Package Audit (Vivian)

**Location:** Component documents provided separately (not in Design-System-Work folder)

**What it tracks:** Components actually implemented and published to NPM

### Files Provided
1. **COMPONENT_AUDIT.md** - Detailed audit of all components (Updated Feb 25, 2026)
2. **COMPONENT_ACTION_PLAN.md** - Immediate actions needed (Updated Feb 25, 2026)
3. **COMPONENT_REPORTS.md** - Guide to component reports workflow

### Summary Statistics (UDS `main`, April 17, 2026)
- **Total folders in Monorepo:** 98 components (26 atoms + 56 molecules + 15 organisms; templates not in src/)
- **Implemented:** 63 (have `.tsx` + `_stories/` + `_tests/`)
- **Docs-only:** 35 (have `*-documentation.md` but no `.tsx` yet)
- **Partial:** 0 (all implemented components meet code + stories + tests gate)
- **Missing Docs:** 0

### Breakdown by Atomic Level (Implemented on main)
- **Atoms:** 26 implemented, 1 docs-only (ProgressBarFill)
- **Molecules:** 32 implemented, 24 docs-only
- **Organisms:** 5 implemented, 10 docs-only

### Implemented Components (63) — UDS `main`, Apr 17, 2026

**Atoms (26):**
Badge, Breadcrumb, Checkbox, Divider, FieldMessage, HelperText, Icon, Indicator Counter, Indicator Dot, Input, Label, Logo, MenuToggleIcon, Overlay, ProgressBar, ProgressRing, RadioButton, SkipLink, SliderRail, SliderThumb, SliderTrack, TextArea, Toggle, Tooltip, UserAvatar, VisuallyHidden

**Molecules (32):**
AccordionHeader, BreadcrumbItem, BreadcrumbTrail, Button, ButtonIcon, CheckboxField, CircularIndicator, CircularProgress, DateInput, DropdownButton, DropdownItem, HeaderButton, InlineSearchField, InputField, LoadingMask, LogoLoader, ModalHeader, MultiSelectItem, NavSubmenuButton, NumberInputField, OverflowPanel, Pill, QuickSearchField, RadioButtonField, SearchField, Slider, SliderField, Tab, TableCell, TextAreaField, ToastMessage, ToggleField

**Organisms (5):**
Accordion, Card, MenuContainer, MenuHeaderOrganism, RadioButtonGroup

### Docs-only Components (35) — scaffolded with `.md` but no `.tsx` on main

**Atoms (1):** ProgressBarFill

**Molecules (24):**
CalendarItemButton, DropdownInput, FileUploadAvatar, FileUploadButton, FileUploadField, FileUploadProgress, FilterButton, HeaderLogoButton, HeaderLogoTitle, ListItem, MenuContainer (molecule), MenuHeader, MenuToggleButton, MultiselectDropdownInput, NavMenuButton, PageHeader, ProgressBar (molecule), SearchBar, StepIndicator, TableActionsHeader, TableFooter, TableRow, TableRowContent, UsernameButton

**Organisms (10):**
BreadcrumbOrganism, DrawerModal, DropdownButton (organism), DropdownInput (organism), FilterMultiselectDropdown, MultiselectDropdownInputField, QuickSearch, SplitButton, TabGroup, Table

### Missing Documentation (0)
All components now have documentation

---

## Source 3: Figma MCP Readiness Status

**Location:** `/Users/taylors/Desktop/ConstructConnect-Projects/Design-System-Work/FIGMA-MCP-REQUIREMENTS-STATUS.md`

**What it tracks:** AI design-to-code workflow readiness

### Summary
- **Total MCP-Ready Components:** 57
- **MCP Readiness Status:** ✅ 100% Complete
- **Last Updated:** February 25, 2026

### 5 Figma MCP Requirements (All Met)
1. ✅ Component Organization and Naming Conventions
2. ✅ Variants and Properties
3. ✅ Design Tokens Integration
4. ✅ Component Documentation
5. ✅ Behavioral Annotations (updated Feb 24, 2026)

### Behavioral Specifications Status
- **27 components** with comprehensive behavioral specs
- **Updated:** February 24, 2026
- **Includes:**
  - Visual state descriptions
  - Transition properties (duration, easing)
  - Trigger behaviors (hover, click, focus, keyboard)
  - Accessibility behaviors (ARIA, screen readers)
  - Use case patterns

### Components with Behavioral Specs
**Atoms (9):**
- Badge, Checkbox, Icon, Indicator Counter, Indicator Dot, Input, Radio Button, Toggle, Tooltip

**Molecules (12):**
- Button Icon, Button Primary, Checkbox Field, Dropdown Button, Dropdown Input, Input Field, Menu Header, Menu Item, Multiselect Item, Pill, Radio Button Field, Toggle Field

**Organisms (6):**
- Dropdown, Filter Multiselect Dropdown, Menu Container, Modal, Multiselect Dropdown Input, Search Field

---

## Source 4: Gap Analysis (February 12, 2026)

**Location:** `/Users/taylors/Desktop/ConstructConnect-Projects/Design-System-Work/COMPONENT-EXTRACTION-GAP-ANALYSIS.md`

**What it tracks:** Components in Figma not yet extracted

### Summary
- **Components in Figma:** ~49 unique components
- **Components Extracted:** 51 (as of Feb 12, some overlap with naming)
- **After Verification:** 52/56 = 93% complete

### Missing Components (As of Feb 12)
**High Priority:**
- Table System (9 components)
- Loading Indicators (3 components)
- Navigation (3 components)

**Still Missing (4 baseline):**
1. loading-spinner (atom)
2. linear-progress-indicator (molecule)
3. circular-progress-indicator (molecule)
4. date-picker (molecule)

**In Progress:**
- Toast Message (audit phase)

**Complex (do last):**
- Table organism

---

## Data Reconciliation

### The Two Inventories

**Design-System-Work (Extraction):**
- 57+ components extracted from Figma
- Have CSS token files
- Have documentation
- Status: **Ready for developers**

**Monorepo (Implementation):**
- 35 components coded
- In NPM package
- Published to Cloudsmith
- Status: **Available to teams**

### The Gap: 22 Components

**57 extracted - 35 implemented = 22 waiting for dev**

These 22 components are fully designed and ready to build:
- ✅ Complete token files
- ✅ Comprehensive documentation
- ✅ Behavioral specifications
- ✅ WCAG compliance specs
- ❌ Not coded yet

---

## Dashboard Metrics Mapping

### Top Metrics Cards

| Metric | Value | Source |
|--------|-------|--------|
| **In NPM Package** | 35 | Vivian's Monorepo Audit (Feb 25, 2026) |
| **Fully Shippable** | 9 | Vivian's Monorepo Audit (Complete) |
| **Design Specs Ready** | 22 | Extracted - Monorepo (57-35) |
| **MCP Ready** | 57 | MCP Readiness Status |
| **Pilot Teams** | 3 | Known: Admin Portal, Crimson, Web Takeoff |

### Delivery Status Donut Chart

| Status | Count | Source |
|--------|-------|--------|
| **Complete** | 9 | Vivian's Audit (Feb 25, 2026) |
| **Partial** | 8 | Vivian's Audit (Feb 25, 2026) |
| **Docs Only** | 17 | Vivian's Audit (Feb 25, 2026) |
| **Missing Docs** | 0 | Vivian's Audit (Feb 25, 2026) |

### Atomic Comparison Chart

| Level | Extracted | Monorepo | Handoff |
|-------|-----------|----------|---------|
| **Atoms** | 14 | 12 | 2 |
| **Molecules** | 28 | 19 | 9 |
| **Organisms** | 15 | 4 | 11 |

**Source:**
- Extracted: Design-System-Work Inventory
- Monorepo: Vivian's Audit (Feb 25, 2026)
- Handoff: Extracted - Monorepo

---

## Update Procedures

### When Vivian Provides New Data:

1. **Update Monorepo counts** in this file
2. **Recalculate "Handoff" values** (Extracted - Monorepo)
3. **Update dashboard JavaScript** variables
4. **Document changes** in version history

### When New Extractions Happen:

1. **Update Extraction Inventory** count
2. **Recalculate "Design Specs Ready"** (Extracted - Monorepo)
3. **Recalculate "Handoff" values**
4. **Update dashboard JavaScript** variables

### When Components Are Implemented:

1. **Update Monorepo count** (+1 to appropriate category)
2. **Update Extraction Inventory** status if needed
3. **Recalculate all derived metrics**
4. **Update dashboard JavaScript** variables

---

## Data Quality Notes

### Naming Discrepancies to Watch
- "Checkbox With Label" in Figma = "Checkbox Field" in code
- "Icon Only Button" in Figma = "Button Icon" in code
- "Range Slider" is NOT separate — built into Slider Field with prop
- "Input Form Field" in Figma = "Input Field" in code

### Status Definitions

**Complete** = Implementation + Storybook docs + JSON tokens + tests
**Partial** = Implementation exists but missing tokens, docs, or naming issues
**Docs Only** = Documentation exists but no implementation
**Missing Docs** = Implementation exists but no documentation
**Extracted** = Tokens and docs created from Figma
**MCP Ready** = Meets all 5 Figma MCP requirements for AI code generation

---

## File Locations Reference

### Design-System-Work Files
```
/Users/taylors/Desktop/ConstructConnect-Projects/Design-System-Work/
├── design-system-tokens/
│   ├── COMPONENT-EXTRACTION-INVENTORY.md (Extraction inventory)
│   ├── 3-components/
│   │   ├── atoms/ (24 token CSS files)
│   │   ├── molecules/ (18 token CSS files)
│   │   ├── organisms/ (6 token CSS files)
│   │   └── documentation/ (27 markdown files)
├── COMPONENT-EXTRACTION-GAP-ANALYSIS.md (Gap analysis)
├── FIGMA-MCP-REQUIREMENTS-STATUS.md (MCP readiness)
└── FIGMA-MCP-DESIGN-TO-CODE-WORKFLOW.md (MCP workflow)
```

### Vivian's Files (Provided Separately)
- COMPONENT_AUDIT.md
- COMPONENT_ACTION_PLAN.md
- COMPONENT_REPORTS.md

### Dashboard Files
```
/Users/taylors/Desktop/ConstructConnect-Projects/blueprint-dashboard/
├── dashboard/blueprint-status.html (Interactive dashboard)
├── data/data-sources.md (This file)
└── README.md (Project overview)
```

---

**Next Update:** When Vivian provides new monorepo data or new components are extracted
