# Cronos AI Agent SDK - Agent Inventory

Complete inventory of all agents available in the Cronos AI Agent SDK v5.2.0, organized by type and functionality.

## 📊 Agent Overview

### Current Built-in Agents
| **Agent Name**            | **ID**                | **Type**      | **Purpose**                                                    |
|---------------------------|-----------------------|---------------|----------------------------------------------------------------|
| Risk Monitor              | `risk-monitor`        | Deterministic | Monitors risk metrics and recommends protective actions        |
| Liquidity Optimizer       | `liquidity-optimizer` | Deterministic | Optimizes liquidity allocation based on market conditions      |
| Emergency Brake           | `emergency-brake`     | Deterministic | Triggers emergency stops when critical thresholds are breached |
| Threshold Guard           | `threshold-guard`     | Deterministic | Enforces threshold limits on operations                        |
| Anomaly Detector          | `anomaly-detector`    | Statistical   | Detects unusual patterns using statistical analysis            |
| **Total Built-in Agents** | **5**               | **4 Deterministic, 1 Statistical** | **Production-ready agents included in SDK** |

### Future Agents (V2 Roadmap)
| **Category**              | **Count** | **Description**                       | **Availability** |
|---------------------------|-----------|---------------------------------------|------------------|
| Risk & Security           | 4         | Advanced risk management and security | Pro Subscription |
| Efficiency & Optimization | 3         | Performance and cost optimization     | Pro Subscription |
| Compliance & Governance   | 2         | Regulatory and institutional features | Pro Subscription |
| Automation & Scheduling   | 2         | Recurring and behavioral automation   | Pro Subscription |
| **Total Future Agents**   | **11**    | Advanced agents in development        | Q1-Q3 2025       |

### Complete Agent Ecosystem
| **Status**        | **Count** | **Total Available**    |
|-------------------|-----------|------------------------|
| ✅ Available Now  | 5         | Built-in agents        |
| 🔄 In Development | 11        | Future Pro agents      |
| **Grand Total**   | **16**    | **Complete ecosystem** |

---

## 🔧 Deterministic Agents

Agents that use rule-based logic with predictable, consistent outcomes.

### 1. Risk Monitor Agent
- **ID**: `risk-monitor`
- **Type**: Deterministic Agent
- **Purpose**: Monitors risk metrics and recommends protective actions
- **What it does**: 
  - Compares balance against threshold values
  - Triggers protective actions when risk levels are exceeded
  - Provides severity-based risk assessment (LOW/HIGH/CRITICAL)
- **Input Requirements**: 
  - `balance` - Current balance to monitor
  - `threshold` - Risk threshold limit
- **Actions**: `ALLOW`, `LIMIT`, `BLOCK`
- **Use Cases**: 
  - DeFi vault protection
  - Lending protocol risk management
  - Portfolio balance monitoring

### 2. Liquidity Optimizer Agent
- **ID**: `liquidity-optimizer`
- **Type**: Deterministic Agent
- **Purpose**: Optimizes liquidity allocation based on market conditions
- **What it does**:
  - Calculates optimal liquidity levels using target ratios
  - Recommends adding or removing liquidity
  - Maintains liquidity within target ranges
- **Input Requirements**:
  - `currentPrice` - Current market price
  - `liquidity` - Current liquidity amount
  - `targetRatio` - Desired liquidity ratio (0.0-1.0)
- **Actions**: `ADD`, `REMOVE`, `HOLD`
- **Use Cases**:
  - DEX liquidity pool management
  - Automated market maker optimization
  - Yield farming strategies

### 3. Emergency Brake Agent
- **ID**: `emergency-brake`
- **Type**: Deterministic Agent
- **Purpose**: Triggers emergency stops when critical thresholds are breached
- **What it does**:
  - Monitors critical system metrics
  - Immediately pauses operations when thresholds exceeded
  - Provides binary safety decisions
- **Input Requirements**:
  - `metric` - Current metric value to monitor
  - `criticalThreshold` - Critical limit that triggers emergency stop
- **Actions**: `PAUSE`, `RESUME`
- **Use Cases**:
  - Protocol circuit breakers
  - Smart contract emergency stops
  - System overload protection

### 4. Threshold Guard Agent
- **ID**: `threshold-guard`
- **Type**: Deterministic Agent
- **Purpose**: Enforces threshold limits on operations
- **What it does**:
  - Validates values against minimum and maximum limits
  - Caps values at maximum thresholds
  - Rejects values below minimum requirements
- **Input Requirements**:
  - `value` - Value to validate
  - `minThreshold` - Minimum allowed value
  - `maxThreshold` - Maximum allowed value
- **Actions**: `APPROVE`, `REJECT`
- **Use Cases**:
  - Transaction amount validation
  - Parameter boundary enforcement
  - Input sanitization

---

## 📈 Statistical Agents

Agents that use mathematical analysis and statistical methods for decision making.

### 5. Anomaly Detector Agent
- **ID**: `anomaly-detector`
- **Type**: Statistical Agent
- **Purpose**: Detects unusual patterns in contract behavior using statistical analysis
- **What it does**:
  - Calculates Z-scores to identify statistical anomalies
  - Classifies anomaly severity (LOW/MEDIUM/HIGH)
  - Uses standard deviation analysis for pattern detection
- **Input Requirements**:
  - `currentValue` - Current value to analyze
  - `historicalAverage` - Historical average for comparison
  - `standardDeviation` - Standard deviation of historical data
- **Actions**: `NORMAL`, `ANOMALY_DETECTED`
- **Statistical Method**: Z-score analysis (standard deviations from mean)
- **Thresholds**:
  - `> 3 std dev` = HIGH severity
  - `> 2 std dev` = MEDIUM severity  
  - `> 1.5 std dev` = LOW severity
- **Use Cases**:
  - Fraud detection
  - Unusual transaction pattern identification
  - Market manipulation detection

---

## 🚫 Not Available in Current SDK

The following agent types are **NOT** built into the current SDK but can be created as custom agents:

### AI Agents
- **OpenAI Integration Agent** - Uses GPT models for intelligent decisions
- **Natural Language Processing Agent** - Analyzes text-based inputs

### API Integration Agents  
- **External Risk API Agent** - Integrates with third-party risk services
- **Reputation Score Agent** - Fetches user reputation from external APIs
- **Market Data Agent** - Real-time market data integration

### Payment Agents
- **Multi-Provider Payment Agent** - Handles various payment methods
- **Mobile Wallet Agent** - Apple Pay, Google Pay integration
- **Enterprise Connector Agent** - SAP, Oracle, QuickBooks integration

### Event-Driven Agents
- **Blockchain Event Monitor** - Reacts to on-chain events
- **Cross-Chain Event Agent** - Multi-blockchain event monitoring
- **Pattern Sequence Agent** - Detects event sequences

### Machine Learning Agents
- **Predictive Model Agent** - Uses trained ML models
- **Feature Extraction Agent** - Automated feature engineering
- **Reinforcement Learning Agent** - Self-improving decision making

### Time-Based Agents
- **Schedule-Based Agent** - Time window restrictions
- **Holiday/Maintenance Agent** - Calendar-aware decisions
- **Frequency Limiting Agent** - Rate limiting based on time

### Composite Agents
- **Multi-Agent Orchestrator** - Combines multiple agent decisions
- **Weighted Consensus Agent** - Weighted voting system
- **Hierarchical Decision Agent** - Layered decision making

---

## 🔄 Agent Execution Flow

```
1. Context Input → 2. Agent Processing → 3. Decision Output

Input:                Processing:              Output:
- contractId          - Validate context       - action.type
- user               - Apply agent logic       - action.value  
- customData         - Calculate confidence    - reason
                     - Generate metadata       - confidence
                                              - metadata
```

## 📝 Usage Examples

### Basic Agent Registration
```typescript
import { SentinelAgentSDK, RiskMonitor, LiquidityOptimizer } from '@sentinel/ai-agent-sdk';

const sdk = new SentinelAgentSDK({
  network: 'cronos-testnet',
  rpcUrl: 'https://evm-t3.cronos.org'
});

// Register built-in agents
sdk.registerAgent('risk', new RiskMonitor());
sdk.registerAgent('liquidity', new LiquidityOptimizer());
sdk.registerAgent('emergency', new EmergencyBrake());
sdk.registerAgent('threshold', new ThresholdGuard());
sdk.registerAgent('anomaly', new AnomalyDetector());
```

### Agent Execution Examples
```typescript
// Risk Monitor
const riskResult = await sdk.executeAgent('risk', {
  contractId: 'vault-001',
  user: '0xabc...',
  customData: {
    balance: '5000000000000000000',  // 5 ETH
    threshold: '10000000000000000000' // 10 ETH
  }
});

// Liquidity Optimizer  
const liquidityResult = await sdk.executeAgent('liquidity', {
  contractId: 'dex-pool',
  user: '0xdef...',
  customData: {
    currentPrice: 2000,
    liquidity: '100000000000000000000', // 100 tokens
    targetRatio: 0.8
  }
});

// Emergency Brake
const emergencyResult = await sdk.executeAgent('emergency', {
  contractId: 'protocol',
  user: '0x123...',
  customData: {
    metric: 95,
    criticalThreshold: 90
  }
});

// Threshold Guard
const thresholdResult = await sdk.executeAgent('threshold', {
  contractId: 'validator',
  user: '0x456...',
  customData: {
    value: '150000000000000000000', // 150 tokens
    minThreshold: '100000000000000000000', // 100 tokens
    maxThreshold: '100000000000000000000'  // 100 tokens (will cap)
  }
});

// Anomaly Detector
const anomalyResult = await sdk.executeAgent('anomaly', {
  contractId: 'monitor',
  user: '0x789...',
  customData: {
    currentValue: 1000,
    historicalAverage: 500,
    standardDeviation: 100
  }
});
```

## 🎯 Agent Selection Guide

| **Use Case** | **Recommended Agent** | **Why** |
|--------------|----------------------|---------|
| Balance protection | Risk Monitor | Monitors balance vs threshold |
| DEX pool management | Liquidity Optimizer | Optimizes liquidity ratios |
| System safety | Emergency Brake | Immediate emergency stops |
| Input validation | Threshold Guard | Enforces min/max limits |
| Fraud detection | Anomaly Detector | Statistical pattern analysis |
| Complex scenarios | Multiple agents | Combine for comprehensive coverage |

## 🔧 Custom Agent Development

To create agents not available in the built-in set:

1. **Extend BaseAgent** - All agents must extend the BaseAgent class
2. **Implement decide()** - Core decision logic method
3. **Define config** - Agent metadata and identification
4. **Add error handling** - Robust error management
5. **Register with SDK** - Make available for execution

See [CUSTOM_AGENT_TYPES.md](./CUSTOM_AGENT_TYPES.md) for detailed implementation guides.

---

## 📚 Additional Resources

- **[Getting Started Guide](./docs/getting-started.md)** - SDK setup and basic usage
- **[Custom Agent Development](./CUSTOM_AGENT_TYPES.md)** - Building your own agents
- **[API Reference](./docs/api-reference.md)** - Complete SDK documentation
- **[Agent Features Roadmap](./AGENTS_FEATURES.md)** - Future agents in development
- **[UI Integration Guide](./UIDifferences.md)** - Frontend integration patterns

## 🏷️ Version Information

- **SDK Version**: v5.2.0
- **Agent API Version**: 1.0.0
- **Last Updated**: December 2024
- **Compatibility**: Cronos EVM, Ethereum-compatible networksmplementation guides.

---

## 📊 Summary

The Cronos AI Agent SDK v5.2.0 includes **5 production-ready built-in agents** covering essential DeFi and blockchain use cases:

- **4 Deterministic Agents** for rule-based decisions
- **1 Statistical Agent** for pattern detection
- **Extensible architecture** for custom agent development
- **Enterprise features** including policy enforcement and audit trails
- **Type-safe TypeScript** implementation with full IntelliSense support

All agents are battle-tested, well-documented, and ready for production deployment in DeFi protocols, smart contract systems, and blockchain applications.