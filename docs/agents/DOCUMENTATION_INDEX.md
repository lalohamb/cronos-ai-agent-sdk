# Built-in Agents - Complete Documentation Index

## 📁 Documentation Structure

```
docs/agents/
├── README.md                      # Start here - Main index
├── DOCUMENTATION_INDEX.md         # This file - Complete navigation guide
│
├── 📘 Getting Started
│   ├── AGENTS_OVERVIEW.md         # What agents do and don't do
│   └── AGENTS_COMPARISON.md       # Compare all agents side-by-side
│
├── 📗 Individual Agent Guides
│   ├── RISK_MONITOR.md            # RiskMonitor agent documentation
│   ├── LIQUIDITY_OPTIMIZER.md     # LiquidityOptimizer agent documentation
│   ├── EMERGENCY_BRAKE.md         # EmergencyBrake agent documentation
│   ├── THRESHOLD_GUARD.md         # ThresholdGuard agent documentation
│   └── ANOMALY_DETECTOR.md        # AnomalyDetector agent documentation
│
└── 📙 Advanced Topics
    └── IMPLEMENTATION_PATTERNS.md  # Real-world implementation patterns
```

---

## 🚀 Quick Navigation

### I'm New to Agents
1. Start with **[README.md](./README.md)** - Quick overview and setup
2. Read **[AGENTS_OVERVIEW.md](./AGENTS_OVERVIEW.md)** - Understand the core concepts
3. Check **[AGENTS_COMPARISON.md](./AGENTS_COMPARISON.md)** - See which agent fits your needs

### I Want to Use a Specific Agent
- **Risk Management?** → [RISK_MONITOR.md](./RISK_MONITOR.md)
- **DEX/AMM Optimization?** → [LIQUIDITY_OPTIMIZER.md](./LIQUIDITY_OPTIMIZER.md)
- **Emergency Stops?** → [EMERGENCY_BRAKE.md](./EMERGENCY_BRAKE.md)
- **Transaction Limits?** → [THRESHOLD_GUARD.md](./THRESHOLD_GUARD.md)
- **Fraud Detection?** → [ANOMALY_DETECTOR.md](./ANOMALY_DETECTOR.md)

### I'm Ready to Implement
- **Implementation Patterns** → [IMPLEMENTATION_PATTERNS.md](./IMPLEMENTATION_PATTERNS.md)
- **Real-World Examples** → See individual agent guides

---

## 📚 Document Summaries

### [README.md](./README.md)
**Purpose:** Main entry point for agent documentation

**Contents:**
- Quick reference for all 5 agents
- Installation and setup
- Basic usage examples
- Testing instructions

**Read this if:** You're new to the SDK or need a quick reference

---

### [AGENTS_OVERVIEW.md](./AGENTS_OVERVIEW.md)
**Purpose:** Fundamental concepts and architecture

**Contents:**
- What agents actually do (advisory vs. executive)
- The decision flow (Agent → Your Code → Blockchain)
- Why this design is powerful
- Security and flexibility benefits

**Read this if:** You need to understand how agents work at a conceptual level

---

### [AGENTS_COMPARISON.md](./AGENTS_COMPARISON.md)
**Purpose:** Side-by-side comparison of all agents

**Contents:**
- Quick reference table
- When to use which agent
- Combining multiple agents
- Confidence levels explained
- Agent "personalities"

**Read this if:** You're choosing which agent(s) to use for your project

---

### [RISK_MONITOR.md](./RISK_MONITOR.md)
**Purpose:** Complete guide to the RiskMonitor agent

**Contents:**
- Decision logic (BLOCK/LIMIT/ALLOW)
- Required input data
- 4 implementation options
- Real-world DeFi example
- Testing instructions

**Read this if:** You're building a lending protocol, vault, or collateral system

---

### [LIQUIDITY_OPTIMIZER.md](./LIQUIDITY_OPTIMIZER.md)
**Purpose:** Complete guide to the LiquidityOptimizer agent

**Contents:**
- Decision logic (ADD/REMOVE/HOLD)
- Required input data
- 4 implementation options
- Real-world DEX example
- Testing instructions

**Read this if:** You're building a DEX, AMM, or liquidity pool

---

### [EMERGENCY_BRAKE.md](./EMERGENCY_BRAKE.md)
**Purpose:** Complete guide to the EmergencyBrake agent

**Contents:**
- Decision logic (PAUSE/RESUME)
- Required input data
- 4 implementation options
- Real-world circuit breaker example
- Common use cases (TVL drop, oracle failure, etc.)

**Read this if:** You need emergency stop functionality or circuit breakers

---

### [THRESHOLD_GUARD.md](./THRESHOLD_GUARD.md)
**Purpose:** Complete guide to the ThresholdGuard agent

**Contents:**
- Decision logic (APPROVE/REJECT)
- Required input data
- 4 implementation options
- Real-world withdrawal limits example
- Daily limit enforcement

**Read this if:** You need to enforce min/max limits on transactions

---

### [ANOMALY_DETECTOR.md](./ANOMALY_DETECTOR.md)
**Purpose:** Complete guide to the AnomalyDetector agent

**Contents:**
- Decision logic (Z-score based)
- Severity levels (LOW/MEDIUM/HIGH)
- Required input data
- 4 implementation options (fraud, DDoS, oracle, gaming)
- Real-world NFT wash trading example

**Read this if:** You need fraud detection or pattern analysis

---

### [IMPLEMENTATION_PATTERNS.md](./IMPLEMENTATION_PATTERNS.md)
**Purpose:** Real-world implementation strategies

**Contents:**
- 4 implementation strategies:
  1. Direct execution (on-chain)
  2. Human-in-the-loop
  3. Confidence-based execution
  4. Simulation first
- Multi-agent patterns (sequential, voting, weighted)
- Complete DeFi vault example
- Best practices

**Read this if:** You're ready to implement agents in production

---

## 🎯 Use Case → Documentation Map

### DeFi Lending Protocol
1. [RISK_MONITOR.md](./RISK_MONITOR.md) - Monitor collateral ratios
2. [THRESHOLD_GUARD.md](./THRESHOLD_GUARD.md) - Enforce borrow limits
3. [EMERGENCY_BRAKE.md](./EMERGENCY_BRAKE.md) - Circuit breaker for TVL drops
4. [IMPLEMENTATION_PATTERNS.md](./IMPLEMENTATION_PATTERNS.md) - Multi-layer protection

### DEX / AMM
1. [LIQUIDITY_OPTIMIZER.md](./LIQUIDITY_OPTIMIZER.md) - Optimize pool ratios
2. [THRESHOLD_GUARD.md](./THRESHOLD_GUARD.md) - Min/max swap amounts
3. [ANOMALY_DETECTOR.md](./ANOMALY_DETECTOR.md) - Detect price manipulation

### NFT Marketplace
1. [ANOMALY_DETECTOR.md](./ANOMALY_DETECTOR.md) - Detect wash trading
2. [THRESHOLD_GUARD.md](./THRESHOLD_GUARD.md) - Min/max listing prices
3. [IMPLEMENTATION_PATTERNS.md](./IMPLEMENTATION_PATTERNS.md) - Fraud prevention patterns

### Payment System
1. [THRESHOLD_GUARD.md](./THRESHOLD_GUARD.md) - Daily withdrawal limits
2. [ANOMALY_DETECTOR.md](./ANOMALY_DETECTOR.md) - Unusual transaction patterns
3. [RISK_MONITOR.md](./RISK_MONITOR.md) - Account balance monitoring

### Gaming / Rewards
1. [ANOMALY_DETECTOR.md](./ANOMALY_DETECTOR.md) - Anti-cheat detection
2. [THRESHOLD_GUARD.md](./THRESHOLD_GUARD.md) - Reward caps
3. [IMPLEMENTATION_PATTERNS.md](./IMPLEMENTATION_PATTERNS.md) - Confidence-based execution

---

## 📖 Reading Order Recommendations

### For Beginners
1. [README.md](./README.md)
2. [AGENTS_OVERVIEW.md](./AGENTS_OVERVIEW.md)
3. [AGENTS_COMPARISON.md](./AGENTS_COMPARISON.md)
4. Pick one agent guide based on your use case
5. [IMPLEMENTATION_PATTERNS.md](./IMPLEMENTATION_PATTERNS.md)

### For Experienced Developers
1. [AGENTS_COMPARISON.md](./AGENTS_COMPARISON.md) - Quick overview
2. Relevant agent guides for your use case
3. [IMPLEMENTATION_PATTERNS.md](./IMPLEMENTATION_PATTERNS.md) - Production patterns

### For Decision Makers
1. [AGENTS_OVERVIEW.md](./AGENTS_OVERVIEW.md) - Understand the architecture
2. [AGENTS_COMPARISON.md](./AGENTS_COMPARISON.md) - See capabilities
3. Individual agent guides - See real-world examples

---

## 🔗 External Resources

- **Main SDK Documentation:** `../../AGENTS_SDK.md`
- **Custom Agent Development:** `../../CUSTOM_AGENT_TYPES.md`
- **User Stories:** `../../USER_STORIES.md`
- **Setup Guide:** `../../SETUP_GUIDE.md`

---

## 📝 Document Maintenance

**Last Updated:** 2025-12-20

**Version:** 1.0.0

**Maintained By:** Cronos AI Agent SDK Team

**Feedback:** Please open an issue or PR if you find errors or have suggestions!

