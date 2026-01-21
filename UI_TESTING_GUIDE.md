# UI Testing Guide - Policy Pack System

This guide walks you through testing the new Policy Pack system in the Cronos AI Agent SDK UI.

## Quick Start

1. **Run the test script:**
   ```bash
   cd packages/examples/ui-demo
   node test-ui.js
   ```

2. **Start the demo:**
   ```bash
   npm run dev
   ```

3. **Open your browser to:** `http://localhost:5173`

## What You'll See

### 🏠 Dashboard Header
- **Title**: "Cronos AI Agent Dashboard"
- **Policy Version**: Shows current policy pack version (e.g., "2025.12.17.1")
- **Runtime ID**: Displays the last 8 characters of the runtime ID

### 📊 Policy Manager Component

The Policy Manager is the star of this demo, showcasing the new Policy Pack system:

#### Policy Pack Status Section
- **Policy Version**: Current active policy version
- **Runtime ID**: Truncated runtime identifier
- **Pack Version**: Semantic version of the policy pack
- **Issued Date**: When the policy pack was created
- **Issuer**: Who issued the policy pack
- **Signature**: Truncated cryptographic signature
- **Total Rulesets**: Count of all rulesets (enabled/disabled)

#### Interactive Rulesets
Each ruleset displays:
- **Color-coded scope badges**:
  - 🟢 **Global** (green): Applies to all agents
  - 🔵 **Agent** (blue): Applies to specific agents
  - 🟡 **Contract** (yellow): Applies to specific contracts
- **Priority indicators**: Higher numbers = higher priority
- **Enable/Disable status**: Green for enabled, red for disabled
- **Click to expand**: Shows detailed rules and configuration

#### Rule Details (when expanded)
- **Rule types with icons**:
  - 📏 **Clamp**: Limits numeric values to min/max ranges
  - 🚫 **DenyIf**: Blocks decisions based on conditions
  - 🏷️ **RequireTag**: Requires specific metadata tags
- **Field paths**: Shows which decision fields are affected
- **Conditions**: Displays operators and values for denyIf rules
- **Constraints**: Shows min/max values for clamp rules

## Test Data Overview

The demo includes comprehensive test data:

### 5 Different Rulesets

1. **Global Safety Limits** (Priority 100, Enabled)
   - Clamps `action.value` to max 1000
   - Requires `approved` tag

2. **Risk Monitor Rules** (Priority 200, Enabled)
   - Denies if `metadata.riskScore > 85`
   - Clamps `confidence` to min 0.7

3. **Liquidity Constraints** (Priority 150, Enabled)
   - Clamps `action.value` between 100-5000
   - Denies if `metadata.liquidityRatio < 0.1`

4. **Vault Contract Limits** (Priority 180, Enabled)
   - Clamps `action.value` to max 2000
   - Requires `vault-approved` tag

5. **Emergency Rules** (Priority 300, **Disabled**)
   - Denies emergency-stop actions (disabled for demo)

### 3 Registered Agents
- **risk-monitor**: Risk monitoring agent
- **liquidity-optimizer**: Liquidity optimization agent
- **emergency-brake**: Emergency response agent

## Testing Scenarios

### 1. Policy Pack Display Test
✅ **Expected**: Policy Manager shows all 5 rulesets with correct information
✅ **Verify**: Color coding matches scope types
✅ **Check**: Enabled/disabled status is clearly visible

### 2. Ruleset Expansion Test
✅ **Action**: Click on any ruleset header
✅ **Expected**: Ruleset expands to show detailed rules
✅ **Verify**: Rule icons and descriptions are correct
✅ **Check**: Field paths and conditions are displayed properly

### 3. Agent Registration Test
✅ **Expected**: AgentConsole shows 3 registered agents
✅ **Verify**: Agents can be selected and executed
✅ **Check**: Agent decisions are recorded

### 4. Policy Enforcement Test
✅ **Action**: Execute an agent through AgentConsole
✅ **Expected**: Policy rules are applied to decisions
✅ **Verify**: Clamp rules limit values appropriately
✅ **Check**: Decision records include policy version

### 5. Real-time Updates Test
✅ **Expected**: Policy pack refreshes every 30 seconds
✅ **Verify**: UI updates automatically
✅ **Check**: No manual refresh needed

## UI Features Demonstrated

### ✨ Visual Enhancements
- **Color-coded scope badges**: Easy identification of rule scope
- **Priority indicators**: Clear hierarchy of rule importance
- **Status indicators**: Immediate visibility of enabled/disabled state
- **Expandable sections**: Progressive disclosure of information
- **Icon system**: Visual representation of rule types

### 🔄 Interactive Elements
- **Click to expand**: Detailed rule information on demand
- **Hover effects**: Better user experience
- **Responsive layout**: Works on different screen sizes
- **Real-time updates**: Automatic policy pack refresh

### 📊 Information Architecture
- **Hierarchical display**: Policy Pack → Rulesets → Rules
- **Contextual information**: Scope-specific details
- **Metadata display**: Signatures, timestamps, issuers
- **Status overview**: Quick summary of policy state

## Troubleshooting

### Common Issues

1. **"No policy pack loaded"**
   - Check that `policyPack.enabled: true` in SDK config
   - Verify MockControlPlaneClient is properly configured

2. **Empty rulesets**
   - Ensure DemoControlPlaneClient is being used
   - Check browser console for errors

3. **Type errors**
   - Run `node test-ui.js` to verify build
   - Check that all packages are built correctly

### Debug Information

The demo provides debug information in:
- **Browser console**: SDK initialization logs
- **Footer**: Runtime ID and version information
- **Policy Manager**: Detailed policy pack metadata

## Next Steps

After testing the UI, you can:

1. **Customize the demo**: Modify `DemoControlPlaneClient.ts` to test different scenarios
2. **Add new components**: Extend the UI with additional policy management features
3. **Integration testing**: Connect to a real Control Plane service
4. **Production deployment**: Use the components in your own applications

## Success Criteria

✅ **Policy Pack Information**: All metadata displays correctly
✅ **Ruleset Visualization**: Color coding and status indicators work
✅ **Rule Details**: Expansion shows complete rule information
✅ **Agent Integration**: Agents register and execute properly
✅ **Policy Enforcement**: Rules are applied to agent decisions
✅ **Real-time Updates**: UI refreshes automatically
✅ **Type Safety**: No TypeScript errors
✅ **Responsive Design**: Works on different screen sizes

The UI successfully demonstrates the complete Policy Pack system integration!