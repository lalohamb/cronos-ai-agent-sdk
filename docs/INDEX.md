# Cronos AI Agent SDK - Documentation Index

Welcome to the complete documentation for the Cronos AI Agent SDK! This index will help you find exactly what you need.

---

## 🚀 Quick Start

**New to the SDK?** Start here:

1. **[Project Summary (00.md)](../00.md)** - What is the SDK?
2. **[Quick Reference](./QUICK_REFERENCE.md)** - Installation & basic usage
3. **[Agents vs Components](./AGENTS_VS_COMPONENTS.md)** - Understand the core distinction

---

## 🎯 By Role

### I'm a Developer Building a DApp

**Start here:**
1. [Quick Reference](./QUICK_REFERENCE.md) - Get started in 5 minutes
2. [Built-in Agents](./agents/README.md) - Use production-ready agents
3. [User Stories](../USER_STORIES.md) - See real-world examples

**Then explore:**
- [Custom Agent Types](../CUSTOM_AGENT_TYPES.md) - Build your own agents
- [Policy Guide](../PolicyGuide.md) - Add governance
- [X402 Payment System](../X402_README.md) - Monetize your dApp

### I'm an Architect/Technical Lead

**Start here:**
1. [SDK Architecture](./SDK_ARCHITECTURE.md) - Complete system overview
2. [Agents vs Components](./AGENTS_VS_COMPONENTS.md) - Core concepts
3. [SDK Components Guide](./SDK_COMPONENTS_GUIDE.md) - Infrastructure details

**Then explore:**
- [Policy Guide](../PolicyGuide.md) - Governance architecture
- [Security Architecture](./SDK_ARCHITECTURE.md#-security-architecture) - Security layers
- [Design Principles](./SDK_ARCHITECTURE.md#-design-principles) - Architecture decisions

### I'm Writing Documentation

**Start here:**
1. [Documentation Summary](./DOCUMENTATION_SUMMARY.md) - What exists and why
2. [Agents vs Components](./AGENTS_VS_COMPONENTS.md) - Correct terminology
3. [Quick Reference](./QUICK_REFERENCE.md) - Common patterns

**Then explore:**
- All individual agent guides in [agents/](./agents/)
- [SDK Components Guide](./SDK_COMPONENTS_GUIDE.md) - Component details
- [Custom Agent Types](../CUSTOM_AGENT_TYPES.md) - Extension patterns

---

## 📚 By Topic

### Understanding the SDK

| Document | Purpose | Read Time |
|----------|---------|-----------|
| [Project Summary (00.md)](../00.md) | High-level overview | 3 min |
| [Agents vs Components](./AGENTS_VS_COMPONENTS.md) | Core distinction | 10 min |
| [SDK Architecture](./SDK_ARCHITECTURE.md) | Complete architecture | 15 min |
| [Quick Reference](./QUICK_REFERENCE.md) | Cheat sheet | 5 min |

### Agents (Decision-Makers)

| Document | Purpose | Read Time |
|----------|---------|-----------|
| [Built-in Agents Overview](./agents/README.md) | All 5 agents | 10 min |
| [Agents Comparison](./agents/AGENTS_COMPARISON.md) | Side-by-side comparison | 8 min |
| [RiskMonitor](./agents/RISK_MONITOR.md) | Risk assessment agent | 10 min |
| [LiquidityOptimizer](./agents/LIQUIDITY_OPTIMIZER.md) | Liquidity management agent | 10 min |
| [EmergencyBrake](./agents/EMERGENCY_BRAKE.md) | Circuit breaker agent | 10 min |
| [ThresholdGuard](./agents/THRESHOLD_GUARD.md) | Limit enforcement agent | 10 min |
| [AnomalyDetector](./agents/ANOMALY_DETECTOR.md) | Pattern detection agent | 10 min |
| [Custom Agent Types](../CUSTOM_AGENT_TYPES.md) | 10 custom patterns | 20 min |

### Components (Infrastructure)

| Document | Purpose | Read Time |
|----------|---------|-----------|
| [SDK Components Guide](./SDK_COMPONENTS_GUIDE.md) | All 8 components | 20 min |
| [Policy Guide](../PolicyGuide.md) | Policy System | 15 min |
| [X402 Payment System](../X402_README.md) | Payment component | 15 min |

### Implementation

| Document | Purpose | Read Time |
|----------|---------|-----------|
| [Implementation Patterns](./agents/IMPLEMENTATION_PATTERNS.md) | 4 strategies + examples | 15 min |
| [User Stories](../USER_STORIES.md) | Real-world examples | 20 min |
| [Examples Directory](../packages/examples/) | Working code | Varies |

---

## 🔍 By Use Case

### I want to...

#### Understand what agents are
→ [Agents vs Components](./AGENTS_VS_COMPONENTS.md)  
→ [Agents Overview](./agents/AGENTS_OVERVIEW.md)

#### Use a built-in agent
→ [Quick Reference](./QUICK_REFERENCE.md)  
→ [Built-in Agents](./agents/README.md)  
→ Individual agent guides in [agents/](./agents/)

#### Build a custom agent
→ [Custom Agent Types](../CUSTOM_AGENT_TYPES.md)  
→ [Implementation Patterns](./agents/IMPLEMENTATION_PATTERNS.md)

#### Add governance/policies
→ [Policy Guide](../PolicyGuide.md)  
→ [SDK Components Guide - Policy System](./SDK_COMPONENTS_GUIDE.md#1-policy-system)

#### Monetize my dApp
→ [X402 Payment System](../X402_README.md)  
→ [SDK Components Guide - Payment System](./SDK_COMPONENTS_GUIDE.md#3-payment-system-x402)

#### Monitor blockchain events
→ [SDK Components Guide - Event System](./SDK_COMPONENTS_GUIDE.md#5-event-system)  
→ [Quick Reference - Event-Driven Pattern](./QUICK_REFERENCE.md#1-event-driven-agent-execution)

#### Expose a REST API
→ [SDK Components Guide - API Server](./SDK_COMPONENTS_GUIDE.md#6-api-server)

#### Add AI-powered decisions
→ [SDK Components Guide - AI Integration](./SDK_COMPONENTS_GUIDE.md#7-ai-integration)  
→ [Custom Agent Types - AIAgent](../CUSTOM_AGENT_TYPES.md)

#### Audit all decisions
→ [SDK Components Guide - Audit System](./SDK_COMPONENTS_GUIDE.md#8-audit-system)

#### Understand the architecture
→ [SDK Architecture](./SDK_ARCHITECTURE.md)  
→ [SDK Components Guide](./SDK_COMPONENTS_GUIDE.md)

#### See real-world examples
→ [User Stories](../USER_STORIES.md)  
→ [Examples Directory](../packages/examples/)

---

## 📖 Complete File List

### Core Documentation (docs/)
```
docs/
├── INDEX.md                           ← You are here
├── DOCUMENTATION_SUMMARY.md           Summary of all documentation
├── AGENTS_VS_COMPONENTS.md            Agents vs. components distinction
├── SDK_COMPONENTS_GUIDE.md            All 8 components detailed
├── SDK_ARCHITECTURE.md                Complete architecture
├── QUICK_REFERENCE.md                 Cheat sheet
└── agents/
    ├── README.md                      Built-in agents overview
    ├── DOCUMENTATION_INDEX.md         Agent docs navigation
    ├── AGENTS_OVERVIEW.md             Core concepts
    ├── AGENTS_COMPARISON.md           Side-by-side comparison
    ├── RISK_MONITOR.md                RiskMonitor guide
    ├── LIQUIDITY_OPTIMIZER.md         LiquidityOptimizer guide
    ├── EMERGENCY_BRAKE.md             EmergencyBrake guide
    ├── THRESHOLD_GUARD.md             ThresholdGuard guide
    ├── ANOMALY_DETECTOR.md            AnomalyDetector guide
    └── IMPLEMENTATION_PATTERNS.md     Implementation strategies
```

### Root Documentation
```
├── 00.md                              Project summary
├── README.md                          Main documentation
├── CUSTOM_AGENT_TYPES.md              10 custom agent patterns
├── PolicyGuide.md                     Policy System guide
├── X402_README.md                     Payment System guide
└── USER_STORIES.md                    Real-world examples
```

### Source Code
```
packages/
├── core/src/
│   ├── agents/
│   │   ├── builtin/                   5 built-in agents
│   │   ├── BaseAgent.ts               Agent base class
│   │   └── GeniusActComplianceAgent.ts Example custom agent
│   ├── policies/                      Policy System
│   ├── control-plane/                 Control Plane
│   ├── payments/                      Payment System
│   ├── contracts/                     Contract System
│   ├── events/                        Event System
│   ├── api/                           API Server
│   ├── ai/                            AI Integration
│   ├── audit/                         Audit System
│   └── SentinelAgentSDK.ts              Main orchestrator
├── ui/                                React components
└── examples/                          Working demos
```

---

## 🎓 Learning Paths

### Path 1: Quick Start (30 minutes)
1. [Project Summary (00.md)](../00.md) - 3 min
2. [Quick Reference](./QUICK_REFERENCE.md) - 5 min
3. [Built-in Agents](./agents/README.md) - 10 min
4. [User Stories](../USER_STORIES.md) - 12 min

**Outcome:** Understand what the SDK does and how to use it

---

### Path 2: Deep Dive (2 hours)
1. [Agents vs Components](./AGENTS_VS_COMPONENTS.md) - 10 min
2. [SDK Architecture](./SDK_ARCHITECTURE.md) - 15 min
3. [SDK Components Guide](./SDK_COMPONENTS_GUIDE.md) - 20 min
4. All individual agent guides - 50 min
5. [Custom Agent Types](../CUSTOM_AGENT_TYPES.md) - 20 min
6. [Policy Guide](../PolicyGuide.md) - 15 min

**Outcome:** Complete understanding of the SDK architecture and capabilities

---

### Path 3: Custom Agent Development (1 hour)
1. [Agents vs Components](./AGENTS_VS_COMPONENTS.md) - 10 min
2. [Custom Agent Types](../CUSTOM_AGENT_TYPES.md) - 20 min
3. [Implementation Patterns](./agents/IMPLEMENTATION_PATTERNS.md) - 15 min
4. [User Stories](../USER_STORIES.md) - 15 min

**Outcome:** Ability to build custom agents for your use case

---

## 🔗 External Resources

- **GitHub Repository:** [cronos-ai-agent-sdk](https://github.com/your-org/cronos-ai-agent-sdk)
- **NPM Package:** [@sentinel/ai-agent-sdk](https://www.npmjs.com/package/@sentinel/ai-agent-sdk)
- **Cronos Network:** [cronos.org](https://cronos.org)
- **Cronos Testnet:** [evm-t3.cronos.org](https://evm-t3.cronos.org)

---

## 💡 Tips for Navigation

### Use the Search Function
Most markdown viewers support search (Ctrl+F / Cmd+F). Search for:
- Specific agent names: "RiskMonitor", "ThresholdGuard"
- Concepts: "decision", "policy", "payment"
- Code patterns: "executeAgent", "registerAgent"

### Follow the Links
All documentation is cross-referenced. Click links to navigate between related topics.

### Start with Summaries
Each document has a summary section at the top. Read summaries first to decide if you need the full document.

### Use the Quick Reference
[QUICK_REFERENCE.md](./QUICK_REFERENCE.md) has code snippets for common tasks. Copy and adapt them for your use case.

---

## 📊 Documentation Statistics

- **Total Files:** 20+ markdown files
- **Total Lines:** ~3,000 lines of documentation
- **Code Examples:** 100+ complete examples
- **Diagrams:** 10+ architecture diagrams
- **Coverage:** Complete coverage of all agents and components

---

## ✅ Documentation Quality

All documentation includes:
- ✅ Clear explanations
- ✅ Code examples
- ✅ Architecture diagrams
- ✅ Cross-references
- ✅ Real-world use cases
- ✅ Best practices
- ✅ Testing instructions

---

## 🎉 Ready to Start?

**Recommended first steps:**

1. Read [Quick Reference](./QUICK_REFERENCE.md) (5 min)
2. Try the [standalone test](../packages/examples/standalone-test/) (10 min)
3. Read about your use case in [User Stories](../USER_STORIES.md) (15 min)
4. Build your first custom agent using [Custom Agent Types](../CUSTOM_AGENT_TYPES.md) (30 min)

**Happy building!** 🚀

