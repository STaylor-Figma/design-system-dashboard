# Dashboard Update Procedures

**How to update the Blueprint Design System Dashboard**

---

## Quick Update Workflow

1. **Receive new data** from Vivian or extraction work
2. **Update data-sources.md** with new counts
3. **Calculate derived metrics** (handoff values, percentages)
4. **Edit dashboard HTML** JavaScript variables
5. **Test locally** by opening in browser
6. **Document changes** in version history

---

## Step-by-Step: Updating Dashboard Data

### Step 1: Update Data Sources Document

**File:** `blueprint-dashboard/data/data-sources.md`

**Update sections:**
- Source 2 (Monorepo) if Vivian provides new audit
- Source 1 (Extraction) if new components extracted
- Reconciliation section with new gap calculations

**Example:**
```markdown
### Summary Statistics
- **Total in Monorepo:** 32 components  ← (was 30, added 2)
- **Complete:** 13 (was 11, added 2)
```

### Step 2: Calculate Derived Metrics

**Formulas:**

```
Design Specs Ready = Extracted - Monorepo
Handoff (by level) = Extracted (level) - Monorepo (level)
```

**Example:**
```
Extracted = 57
Monorepo = 32 (was 30, +2)
Design Specs Ready = 57 - 32 = 25 (was 27, -2)
```

### Step 3: Edit Dashboard JavaScript Variables

**File:** `blueprint-dashboard/dashboard/blueprint-status.html`

**Lines to edit:** ~200-350 (Data section)

#### Variable 1: topMetrics
```javascript
var topMetrics = [
  {label:"In NPM Package",value:32,sub:"Monorepo components",color:"#0C79A8"},  // Update value
  {label:"Fully Shippable",value:13,sub:"Impl + docs + tokens",color:"#459D13"}, // Update value
  {label:"Design Specs Ready",value:25,sub:"Extracted, awaiting impl",color:"#ED7800"}, // Update value
  {label:"MCP Ready",value:57,sub:"AI code generation",color:"#0C79A8"}, // Usually stays same unless new extractions
  {label:"Pilot Teams",value:3,sub:"Active adoption",color:"#185A7D"} // Update if new teams
];
```

#### Variable 2: deliveryStatus
```javascript
var deliveryStatus = [
  {name:"Complete",value:13,color:"#459D13"},  // Update from Vivian's audit
  {name:"Partial",value:6,color:"#ED7800"},    // Update from Vivian's audit
  {name:"Docs Only",value:10,color:"#0C79A8"}, // Update from Vivian's audit
  {name:"Missing Docs",value:1,color:"#88888E"} // Update from Vivian's audit
];
```

#### Variable 3: completeComponents
```javascript
var completeComponents = [
  {name:"Checkbox",type:"Atom"},
  {name:"Indicator (Dot/Counter)",type:"Atom"},
  // ... existing components
  {name:"NewComponent",type:"Molecule"} // Add new complete components here
];
```

#### Variable 4: atomicComparison
```javascript
var atomicComparison = [
  {level:"Atoms",extracted:14,monorepo:12,handoff:2},      // Update monorepo and handoff
  {level:"Molecules",extracted:28,monorepo:19,handoff:9},  // Update monorepo and handoff
  {level:"Organisms",extracted:15,monorepo:1,handoff:14}   // Update monorepo and handoff
];
```

#### Variable 5: systems (if system implementation changes)
```javascript
var systems = [
  {name:"Boolean Controls",components:6,implemented:6,status:"done"},
  {name:"Form Inputs",components:5,implemented:4,status:"partial"}, // Example: was 3, now 4
  // ... rest of systems
];
```

#### Variable 6: popoverData (if content needs updating)
```javascript
var popoverData = {
  "In NPM Package": "32 components in @unified_design_system/components...", // Update text
  "Fully Shippable": "13 complete: Checkbox, Indicator...", // Update text
  // ... rest of popovers
};
```

### Step 4: Test Dashboard Locally

```bash
# Open dashboard in browser
open /Users/taylors/Desktop/ConstructConnect-Projects/blueprint-dashboard/dashboard/blueprint-status.html
```

**Check:**
- ✅ Top metric cards show correct values
- ✅ Donut chart updates correctly
- ✅ Component lists are accurate
- ✅ Bar chart reflects new data
- ✅ Popovers display correctly
- ✅ All tabs render properly

### Step 5: Document Changes

**Update:** `blueprint-dashboard/README.md`

Add to version history:
```markdown
### v2.1 - [Date]
- ✅ Updated monorepo count to 32 (+2 components)
- ✅ Updated complete components to 13 (+2)
- ✅ Recalculated design specs ready to 25 (-2)
- ✅ Added [ComponentName] to complete list
```

---

## Common Update Scenarios

### Scenario 1: New Components Implemented

**When:** Developer implements components from "Ready for Dev" list

**Updates needed:**
1. Monorepo count: +1 or +2
2. Fully Shippable: +1 if complete
3. Design Specs Ready: -1 (moved from design to dev)
4. atomicComparison: Update monorepo and handoff columns
5. completeComponents or partialComponents: Add to appropriate list
6. systems: Update implementation count for relevant system

**Example:**
```
SearchField molecule implemented with full tokens/docs:
- In NPM Package: 30 → 31
- Fully Shippable: 11 → 12
- Design Specs Ready: 27 → 26
- Molecules monorepo: 17 → 18
- Molecules handoff: 11 → 10
- Add to completeComponents list
- Form Inputs system: implemented 3 → 4
```

### Scenario 2: New Components Extracted from Figma

**When:** New token extraction completed

**Updates needed:**
1. Total extracted count: +1 or more
2. MCP Ready: +1 or more
3. Design Specs Ready: +1 (new component ready for dev)
4. atomicComparison: Update extracted and handoff columns
5. Growth card: Update "Feb 2026" number

**Example:**
```
Table system extracted (9 components):
- Total Extracted: 57 → 66
- MCP Ready: 57 → 66
- Design Specs Ready: 27 → 36
- Update atomic breakdown
- Update growth card: 57 → 66
```

### Scenario 3: Components Moved from Partial to Complete

**When:** Missing tokens/docs added to partial components

**Updates needed:**
1. deliveryStatus: Move from Partial to Complete
2. completeComponents: Add to list
3. partialComponents: Remove from list
4. Fully Shippable: +1

**Example:**
```
Icon atom tokens added:
- deliveryStatus Partial: 6 → 5
- deliveryStatus Complete: 11 → 12
- Fully Shippable: 11 → 12
- Move Icon from partialComponents to completeComponents
```

### Scenario 4: New Pilot Team Added

**When:** New team starts using NPM package

**Updates needed:**
1. Pilot Teams metric: +1
2. Pipeline tab team cards: Add new team
3. Popover content: Update team list

**Example:**
```
Payment Portal team starts:
- Pilot Teams: 3 → 4
- Add team card to renderPipeline function
- Update "Pilot Teams" popover with new team info
```

---

## Dashboard JavaScript Structure Reference

### Data Variables Location
**Lines ~200-350** in `blueprint-status.html`

```javascript
// ═══════════════════════════════════════════════════════
// DATA — Edit values here to update dashboard
// ═══════════════════════════════════════════════════════

var topMetrics = [...];          // Line ~208
var deliveryStatus = [...];      // Line ~216
var completeComponents = [...];  // Line ~224
var partialComponents = [...];   // Line ~237
var atomicComparison = [...];    // Line ~247
var systems = [...];             // Line ~253
var closedGaps = [...];          // Line ~267
var remainingGaps = [...];       // Line ~277
var popoverData = {...};         // Line ~290
var gapReadiness = [...];        // Line ~305
```

### Rendering Functions Location
**Lines ~350-800+** in `blueprint-status.html`

- **renderOverview()** - Lines ~450-550
- **renderPipeline()** - Lines ~550-650
- **renderGaps()** - Lines ~650-720
- **renderSystems()** - Lines ~720-800+

**Note:** Don't edit rendering functions unless adding new features. Only edit data variables.

---

## Validation Checklist

Before finalizing dashboard updates:

- [ ] All numbers add up correctly
- [ ] Donut chart total = Sum of delivery status values
- [ ] Extracted = Monorepo + Handoff (for each atomic level)
- [ ] Complete count matches length of completeComponents array
- [ ] Partial count matches length of partialComponents array
- [ ] Popover text updated if needed
- [ ] All tabs load without errors
- [ ] Info buttons work correctly
- [ ] Version history updated in README
- [ ] data-sources.md reflects new data

---

## Troubleshooting

### Issue: Dashboard doesn't update after editing

**Solution:** Hard refresh browser (Cmd+Shift+R or Ctrl+Shift+R)

### Issue: JavaScript error in console

**Solution:**
1. Check for syntax errors in JavaScript (missing commas, brackets)
2. Validate JSON structure
3. Ensure all variable names match exactly

### Issue: Donut chart looks wrong

**Solution:** Verify deliveryStatus values add up to 30 (or current monorepo total)

### Issue: Bar chart height issues

**Solution:** Check atomicComparison values are reasonable (no negative numbers)

### Issue: Popover not showing

**Solution:**
1. Verify popoverData key matches metric label exactly
2. Check for HTML syntax errors in popover content
3. Ensure onclick handler is present

---

## Contact for Help

**Maintained by:** Taylor S.
**For questions about:**
- Dashboard updates → Ask Taylor
- Vivian's data → Check with Vivian
- Extraction data → Check Design-System-Work folder

**Quick reference files:**
- `data/data-sources.md` - All data locations
- `docs/data-dictionary.md` - Metric definitions
- This file - Update procedures
