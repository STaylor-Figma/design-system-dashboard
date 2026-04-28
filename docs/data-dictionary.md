# Blueprint Dashboard - Data Dictionary

**Definitions of all metrics, terms, and categories used in the dashboard**

---

## Key Metrics (Top Cards)

### In NPM Package
**Definition:** Total number of components published to `@unified_design_system/components` NPM package via Cloudsmith registry.

**Current Value:** 35 components
**Source:** Vivian's Monorepo Audit (COMPONENT_AUDIT.md - Feb 25, 2026)
**Breakdown:** 12 Atoms + 19 Molecules + 4 Organisms

**Includes:**
- Components with code implementation
- Components that can be installed via npm
- Both complete and partial components

**Does NOT include:**
- Components only in Design-System-Work folder
- Components with docs but no implementation

---

### Fully Shippable
**Definition:** Components that are 100% production-ready with all artifacts.

**Current Value:** 9 components
**Source:** Vivian's Audit (Complete category - Feb 25, 2026)

**Requirements to be "Fully Shippable":**
- ✅ Code implementation in monorepo
- ✅ Storybook documentation
- ✅ JSON token files
- ✅ Test coverage
- ✅ All states working correctly

**List:**
1. Checkbox (Atom)
2. Indicator - Dot/Counter (Atoms)
3. Input (Atom)
4. Label (Atom)
5. RadioButton (Atom)
6. Button (Molecule)
7. InputField (Molecule)
8. Pill (Molecule)
9. ToggleField (Molecule)

---

### Design Specs Ready
**Definition:** Components extracted from Figma with complete tokens and documentation, ready for developers to implement.

**Current Value:** 22 components
**Source:** Calculated (Extracted - In NPM Package = 57 - 35)

**These components have:**
- ✅ CSS token files
- ✅ Comprehensive documentation
- ✅ Behavioral specifications
- ✅ WCAG compliance specs
- ❌ No code implementation yet

**Status:** Waiting in Design-System-Work folder for developers to build

---

### MCP Ready
**Definition:** Total components ready for AI-powered design-to-code workflows per Figma MCP requirements.

**Current Value:** 57 components
**Source:** FIGMA-MCP-REQUIREMENTS-STATUS.md

**Requirements Met (All 5):**
1. ✅ Component Organization and Naming Conventions
2. ✅ Variants and Properties
3. ✅ Design Tokens Integration
4. ✅ Component Documentation
5. ✅ Behavioral Annotations (27 components updated Feb 24, 2026)

**Includes:**
- All extracted components (57)
- Complete behavioral specifications
- AI agents can generate production code

---

### Pilot Teams
**Definition:** Teams engaged with the UDS NPM package (Active + In Progress). Status tracked via GitLab API (code scans) for NPM-package consumers and manual tracking for HubSpot integrations.

**Current Value:** 5 teams engaged (3 Active + 2 In Progress)
**Source:** Adoption tracking list cross-checked against GitLab blob search of the `constructconnect` group for `@unified_design_system/components` and `@unified_design_system/design-tokens` in `package.json` (Apr 21, 2026)

**Active (NPM Package):**
1. **Payment Portal** — Most active adopter. Components confirmed: Button, Input, Badge, Checkbox, Toggle, Label. Repo: `payment-portal-frontend` (project 75827533). Source: GitLab API · Mar 2026 Cloudsmith data.
2. **UCMS (Crimson)** — Working with Khay as the team makes Crimson React. Two consumer repos: `ucms-frontend` (project 62250132) + `crimson-v2-frontend` / "Fusion" (project 81307159). Component list pending scan.
3. **Automation Support** — `qhub-portal` (project 79943071) depends on `@unified_design_system/components` (confirmed via GitLab, Apr 2026).

**In Progress (NPM Package):**
4. **GCV4** — Active conversations, onboarding in progress. Component list pending scan.
5. **Identity Platform** (user management portal + admin portal) — Using buttons. Component list pending scan.

**Planned Pipeline:**
- **OST** — HubSpot integration, onboarding planned (manual tracking, N/A Cloudsmith)
- **FAI** — HubSpot integration, onboarding planned (manual tracking, N/A Cloudsmith)
- **API Services** (Developers Portal)
- **Planswift** — Reach out to Brandin Thomas re: components used

**Informal / experimental (not counted in "Active Consumers" metric):**
- **AI Center of Excellence** (SWE AI Enablement) — `ai-marketplace-webapp` (project 79833989) depends on UDS in `package.json`. Not on the formal adoption list — decide whether to promote or leave as informal.
- **Takeoff (WebTakeOff FE)** — `webtakeoff_fe` (project 71252819) has `components@^0.1.1` on `develop` branch. Likely informal/experimental.
- **Hackfest 2026** — `construct-pilot-ui` (project 80942214) and `hackathon-whats-that` (project 80942811) are internal hackathon prototypes under the `innovation/hackfest2026/` group.

**Metrics from Teams:**
- 40% dev time reduction
- 100% design consistency
- 100% WCAG AA compliance

---

### Merged Today

**Definition:** Merge requests confirmed merged to UDS `main` since 12:00am for the daily progress report.

**Current Value:** 15 merge requests for Apr 27, 2026
**Source:** `mergedTodayMergeRequests` in `index.html` / `dashboard/blueprint-status.html`, displayed only in the downloaded overview PNG section

**Includes:**

- Merge requests merged to `main` after the local 12:00am daily cutoff
- Component, docs, chore, and fix MRs included in the daily progress report

**Does NOT include:**

- Open merge requests
- MRs merged before today's 12:00am cutoff
- Weekly ticket-linked merge data used for component "New!" badges

---

## Component Status Categories

### Complete
**Definition:** Component is fully implemented, documented, and ready for production use.

**Count:** 9 components
**Requirements:**
- ✅ Implementation in monorepo
- ✅ Storybook documentation
- ✅ JSON token files
- ✅ Test coverage
- ✅ All interactive states working

**Status Color:** Green (#459D13)

---

### Partial
**Definition:** Component is implemented and working but missing some artifacts (tokens, docs, or naming issues).

**Count:** 8 components
**Typical Issues:**
- Missing JSON token files
- Documentation naming doesn't match code
- Token naming mismatches
- Shared token files causing confusion

**Examples:**
- Icon (missing tokens — may be wrapper only)
- TextArea (token naming mismatch)
- Toggle (shares token file with ToggleField)
- CheckboxField (missing tokens)
- RadioButtonField (missing tokens)
- TextAreaField (doc naming fixed, verify completion)
- Tab (missing implementation + tokens)
- RadioButtonGroup (missing tokens, doc renamed)

**Status Color:** Orange (#ED7800)

---

### Docs Only
**Definition:** Component has documentation and design specs but no code implementation yet.

**Count:** 17 components
**Have:**
- ✅ Design documentation
- ✅ Token definitions (some)
- ✅ Usage guidelines

**Don't Have:**
- ❌ Code implementation
- ❌ Storybook stories
- ❌ Test coverage

**Status:** Ready for dev team to build

**Status Color:** Blue (#0C79A8)

---

### Missing Docs
**Definition:** Component is implemented but has no documentation or token files.

**Count:** 0 components
**Update:** All components now have documentation (Logo documentation added Feb 25, 2026)

**Status Color:** Gray (#88888E)

---

## Atomic Design Levels

### Atoms
**Definition:** Smallest, indivisible UI elements with no dependencies on other components.

**Extracted:** 14 components
**In Monorepo:** 12 components
**Handoff:** 2 components ready for dev

**Examples:** Checkbox, Toggle, Badge, Radio Button, Input, Icon, Tooltip, Indicator Dot, Indicator Counter

**Characteristics:**
- Self-contained
- Reusable across many contexts
- Define visual appearance only (no complex interactions)

---

### Molecules
**Definition:** Simple groups of atoms functioning together as a unit.

**Extracted:** 28 components
**In Monorepo:** 19 components
**Handoff:** 9 components ready for dev

**Examples:** Button, Input Field, Checkbox Field, Dropdown Button, Pill, Search Field

**Characteristics:**
- Compose atoms into functional units
- Handle interactive behaviors (hover, focus, active states)
- Include motion tokens
- Single-purpose, reusable patterns

---

### Organisms
**Definition:** Complex components composed of molecules and/or atoms forming distinct sections.

**Extracted:** 15 components
**In Monorepo:** 4 components
**Handoff:** 11 components ready for dev

**Examples:** Header, Dropdown, Menu Container, Modal, Accordion, Navigation systems

**Characteristics:**
- Complex functionality
- Coordinate multiple child components
- Often represent complete UI sections
- May have conditional rendering logic

---

## Data Calculations

### Handoff (Ready for Dev)
**Formula:** `Extracted - In Monorepo`

**By Level:**
- Atoms: 14 - 12 = 2 ready
- Molecules: 28 - 19 = 9 ready
- Organisms: 15 - 4 = 11 ready
- **Total: 57 - 35 = 22 ready**

**Meaning:** Components that have been extracted from Figma but not yet implemented in code.

---

### Completion Rate
**Formula:** `(Complete Components / In Monorepo) × 100`

**Current:** `9 / 35 = 25.7%`

**Meaning:** Percentage of monorepo components that are fully production-ready.

---

### Extraction Rate
**Formula:** `(Extracted / Known Figma Components) × 100`

**Current:** `57 / 60+ = 95%+`

**Meaning:** How much of the Figma library has been extracted.

---

## Component System Categories

### Boolean Controls
**Components:** 6 (Checkbox, Toggle, Radio Button + Field variants)
**Implementation:** 6/6 (100%)
**Status:** Complete

---

### Form Inputs
**Components:** 5 (Input, Input Field, Text Area, Text Area Field, Label)
**Implementation:** 3/5 (60%)
**Status:** Partial
**Waiting:** Text Area variants need completion

---

### Buttons
**Components:** 3 (Button, Button Icon, Dropdown Button)
**Implementation:** 1/3 (33%)
**Status:** Partial
**Waiting:** Button Icon, Dropdown Button

---

### Navigation
**Components:** 5 (Nav Menu Button, Nav Submenu Button, Nav Menu Container, Nav Submenu Container, Nav Submenu Group)
**Implementation:** 0/5 (0%)
**Status:** Ready for Dev
**All extracted, awaiting implementation**

---

### Header
**Components:** 6 (Header organism, Header Button, Header Logo Button, Header Logo Title, Menu Toggle Button, Username Button)
**Implementation:** 0/6 (0%)
**Status:** Ready for Dev
**All extracted, awaiting implementation**

---

### Modal/Drawer
**Components:** 3 (Modal, Modal Header, DrawerModal)
**Implementation:** 0/3 (0%)
**Status:** Ready for Dev
**All extracted, awaiting implementation**

---

### Dropdown/Filter
**Components:** 8 (Dropdown Button, Dropdown Input, Dropdown Item, Filter Button, Filter Multiselect, Multiselect Item, etc.)
**Implementation:** 0/8 (0%)
**Status:** Ready for Dev
**All extracted, awaiting implementation**

---

### Menu System
**Components:** 4 (Menu Container, Menu Header, Menu Item, etc.)
**Implementation:** 0/4 (0%)
**Status:** Ready for Dev
**All extracted, awaiting implementation**

---

### Loading
**Components:** 3 (Circular Indicator, Logo Loader, Loading Mask)
**Implementation:** 0/3 (0%)
**Status:** Ready for Dev
**All extracted, awaiting implementation**

---

### Accordion
**Components:** 2 (Accordion organism, Accordion Header)
**Implementation:** 0/2 (0%)
**Status:** Ready for Dev
**All extracted, awaiting implementation**

---

### Slider
**Components:** 3 (Slider, Slider Thumb, Slider Field)
**Implementation:** 0/3 (0%)
**Status:** Ready for Dev
**All extracted, awaiting implementation**

---

## Gap Categories

### Closed Gaps
**Definition:** Components that were previously missing but have now been extracted from Figma.

**Count:** 8 resolved gaps

**Examples:**
- Modal/Dialog → DrawerModal + Modal Header + Modal Footer
- Slider → Slider system (Input + Label + Circular Indicator)
- Avatar → User Avatar atom
- Accordion → Accordion Header + Accordion organism

---

### Remaining Gaps
**Definition:** Components needed for platform replacement but not yet in Figma or extracted.

**Count:** 9 open gaps

**Priority Levels:**
- **Critical (2):** Progress Bar, Card
- **High (1):** Table
- **Medium-High (1):** Toast Message
- **Medium (2):** Popover, DatePicker
- **Low (2):** Link, Divider
- **Part of Table (1):** Pagination

---

## Sources and Locations

### Design-System-Work Folder
**Location:** `/Users/taylors/Desktop/ConstructConnect-Projects/Design-System-Work/`
**Contains:** Extraction inventory, token files, documentation, MCP status
**Primary Use:** Design specifications and AI readiness

### Monorepo (Separate Codebase)
**Package:** `@unified_design_system/components`
**Location:** Separate repository (packages/components/)
**Contains:** Actual component implementations
**Primary Use:** Production components for teams

### Vivian's Audit Files
**Files:** COMPONENT_AUDIT.md, COMPONENT_ACTION_PLAN.md, COMPONENT_REPORTS.md
**Contains:** Monorepo status, action items, usage guides
**Primary Use:** Implementation tracking and quality assurance

---

## Version Tracking

### Dashboard Version
**Current:** v2.0 (February 25, 2026)
**Previous:** v1.0 (February 23, 2026)

### Data Source Dates
- **Extraction Inventory:** February 21, 2026
- **Monorepo Audit:** February 25, 2026 (Updated)
- **MCP Status:** February 25, 2026
- **Gap Analysis:** February 12, 2026

---

## Glossary

**CSS Token File:** CSS file containing design token variables for a component
**JSON Token File:** Style Dictionary JSON source for token generation
**Behavioral Specifications:** Documentation of component interactions, animations, and accessibility
**WCAG:** Web Content Accessibility Guidelines (AA standard)
**MCP:** Model Context Protocol (Figma integration for AI tools)
**Atomic Design:** Design methodology (atoms → molecules → organisms → templates → pages)
**Handoff:** Components ready to move from design to development
**Monorepo:** Single repository containing multiple related packages
**Cloudsmith:** NPM registry hosting service

---

**Last Updated:** April 27, 2026
**Maintained By:** Taylor S.
