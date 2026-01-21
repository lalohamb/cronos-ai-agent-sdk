# Bolt.new Integration Prompt for Cronos AI Agent SDK

Create a web application that integrates Cronos AI Agent SDK functionality into Bolt.new's existing interface without changing the current visual layout. Add the following features as overlay panels and sidebar extensions:

## Core Requirements

1. **Preserve Bolt's Layout**: Keep all existing Bolt.new UI elements, styling, and navigation unchanged
2. **Add SDK Integration**: Integrate Cronos AI Agent SDK as background functionality
3. **Minimal UI Additions**: Add only essential UI elements as overlays or sidebar panels

## Integration Features

### 1. Agent Control Panel (Collapsible Sidebar)
```typescript
// Add to existing sidebar - collapsible section
interface AgentControlPanel {
  // Built-in agents with toggle switches
  riskMonitor: boolean;
  liquidityOptimizer: boolean;
  emergencyBrake: boolean;
  thresholdGuard: boolean;
  anomalyDetector: boolean;
  
  // Quick execute buttons
  executeAgent(agentId: string, context: any): void;
  viewAgentStatus(): AgentStatus[];
}
```

### 2. Contract Registry (Modal Overlay)
```typescript
// Modal that opens over existing content
interface ContractRegistryModal {
  // Simple form to register contracts
  contractAddress: string;
  contractName: string;
  network: 'cronos-testnet' | 'cronos-mainnet';
  
  // Actions
  registerContract(): void;
  listContracts(): Contract[];
  removeContract(id: string): void;
}
```

### 3. Event Monitor (Bottom Panel)
```typescript
// Collapsible bottom panel showing real-time events
interface EventMonitorPanel {
  // Live event feed
  events: ContractEvent[];
  filters: EventFilter[];
  
  // Minimal controls
  togglePanel(): void;
  clearEvents(): void;
  exportEvents(): void;
}
```

### 4. Policy Manager (Settings Tab)
```typescript
// Add tab to existing settings/preferences
interface PolicyManagerTab {
  // Simple policy rules
  policies: PolicyRule[];
  
  // Basic CRUD operations
  addPolicy(rule: PolicyRule): void;
  removePolicy(id: string): void;
  togglePolicy(id: string): void;
}
```

## Implementation Structure

```
src/
├── components/
│   ├── cronos/                    ← New Cronos components
│   │   ├── AgentControlPanel.tsx  ← Sidebar extension
│   │   ├── ContractModal.tsx      ← Modal overlay
│   │   ├── EventMonitor.tsx       ← Bottom panel
│   │   └── PolicyTab.tsx          ← Settings tab
│   └── [existing bolt components] ← Keep unchanged
├── hooks/
│   ├── useCronosSDK.ts           ← SDK integration hook
│   └── [existing bolt hooks]     ← Keep unchanged
├── services/
│   ├── cronosService.ts          ← SDK wrapper service
│   └── [existing bolt services]  ← Keep unchanged
└── [existing bolt structure]     ← Keep unchanged
```

## Key Integration Points

### 1. SDK Initialization
```typescript
// Initialize SDK in background without UI impact
const useCronosSDK = () => {
  const [sdk, setSdk] = useState<SentinelAgentSDK | null>(null);
  
  useEffect(() => {
    const initSDK = async () => {
      const cronosSDK = new SentinelAgentSDK({
        network: 'cronos-testnet',
        rpcUrl: 'https://evm-t3.cronos.org',
        privateKey: process.env.VITE_AGENT_PRIVATE_KEY
      });
      setSdk(cronosSDK);
    };
    initSDK();
  }, []);
  
  return sdk;
};
```

### 2. UI Integration Strategy
- **Sidebar Extension**: Add collapsible "AI Agents" section to existing sidebar
- **Modal Overlays**: Use existing modal system for contract registration
- **Bottom Panel**: Add collapsible event monitor below main content
- **Settings Tab**: Add "Cronos Agents" tab to existing settings

### 3. Visual Integration Rules
- Use Bolt's existing color scheme and typography
- Follow Bolt's component patterns and spacing
- Maintain Bolt's responsive design principles
- Add subtle indicators (badges, dots) for agent status

## Minimal UI Components

### Agent Status Indicator
```tsx
// Small badge in sidebar showing active agents
<div className="agent-status-badge">
  <span className="status-dot active"></span>
  <span className="agent-count">3 active</span>
</div>
```

### Quick Action Buttons
```tsx
// Minimal buttons in existing toolbar
<button className="cronos-quick-action" title="Execute Risk Monitor">
  🛡️
</button>
<button className="cronos-quick-action" title="View Events">
  📊
</button>
```

### Event Notification Toast
```tsx
// Non-intrusive notifications for important events
<div className="cronos-toast">
  ⚠️ Risk threshold exceeded for Contract 0x123...
  <button onClick={handleDismiss}>×</button>
</div>
```

## Configuration

### Environment Variables
```env
VITE_CRONOS_RPC_URL=https://evm-t3.cronos.org
VITE_AGENT_PRIVATE_KEY=your_private_key
VITE_CRONOS_NETWORK=cronos-testnet
VITE_ENABLE_CRONOS_AGENTS=true
```

### Feature Flags
```typescript
// Allow users to enable/disable Cronos features
interface CronosFeatureFlags {
  enableAgents: boolean;
  enableEventMonitoring: boolean;
  enablePolicyEngine: boolean;
  showAdvancedFeatures: boolean;
}
```

## Integration Steps

1. **Install Dependencies**
   ```bash
   npm install @sentinel/ai-agent-sdk ethers
   ```

2. **Add Cronos Service**
   - Create `cronosService.ts` wrapper
   - Initialize SDK in background
   - Expose minimal API for UI components

3. **Extend Existing Components**
   - Add agent controls to sidebar
   - Add settings tab for policies
   - Add event monitor to bottom panel

4. **Preserve Bolt Functionality**
   - Keep all existing features working
   - Ensure no visual conflicts
   - Maintain performance

## Success Criteria

- ✅ Bolt.new interface remains visually unchanged
- ✅ Cronos AI agents run in background
- ✅ Users can manage agents through minimal UI additions
- ✅ Real-time event monitoring without disruption
- ✅ Policy management integrated into settings
- ✅ No impact on Bolt's core functionality

## Example Usage

```typescript
// User workflow remains the same, with added AI capabilities
1. User creates project in Bolt (unchanged)
2. Cronos agents automatically monitor smart contracts
3. User receives non-intrusive notifications for important events
4. User can manage agents through sidebar panel
5. All existing Bolt features work normally
```

This integration adds powerful AI agent capabilities to Bolt.new while maintaining its clean, familiar interface.