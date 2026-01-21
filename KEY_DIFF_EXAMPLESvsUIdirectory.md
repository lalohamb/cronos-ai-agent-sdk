# Key Differences: Examples vs UI Directory

## Overview

The Cronos AI Agent SDK contains two distinct directories for UI-related code that serve different purposes and audiences.

## 📁 `packages/examples/` - **Demonstration Hub**

### Purpose
Shows how to **use** the SDK in real applications

### Content
Working code examples and tutorials

### Structure
```
packages/examples/
├── vault-automation/     # Complete vault monitoring system
├── dex-liquidity/        # DEX liquidity management  
├── standalone-test/      # Contract-free testing
└── ui-demo/             # React demo app (Vite-based)
```

### Target Audience
- Developers learning the SDK
- Integration examples
- Quick start tutorials

---

## 📁 `packages/ui/` - **Reusable UI Library**

### Purpose
Provides **reusable React components** for building SDK interfaces

### Content
Component library for other developers to import and use

### Structure
```
packages/ui/
├── components/
│   ├── AgentConsole/     # Agent execution interface
│   ├── ContractRegistry/ # Contract management UI
│   ├── Dashboard/        # Overview dashboard
│   ├── EventMonitor/     # Event tracking display
│   └── PolicyManager/    # Policy configuration UI
└── hooks/
    ├── useAgentExecution.ts  # Agent execution hook
    └── useAgentSDK.ts        # SDK initialization hook
```

### Target Audience
- Developers building production apps
- Component library consumers
- UI framework integration

---

## 🔑 **Key Distinction**

| Aspect | `examples/ui-demo/` | `packages/ui/` |
|--------|-------------------|----------------|
| **Type** | Working demo app | Component library |
| **Purpose** | Shows SDK in action | Provides building blocks |
| **Usage** | Copy and modify | Import and compose |
| **Audience** | Learners | Builders |

## 📊 **New Addition: `examples02/`**

### Purpose
Stunning, production-ready demos showcasing advanced SDK integration

### Content
```
packages/examples02/
└── defi-dashboard/       # Beautiful DeFi dashboard with animations
    ├── src/
    │   ├── App.tsx       # Main dashboard component
    │   └── main.tsx      # React entry point
    ├── package.json      # Dependencies (Framer Motion, Recharts)
    └── README.md         # Setup instructions
```

### Features
- **🎨 Visual Excellence**: Gradient backgrounds, glassmorphism effects
- **📊 Real-time Charts**: Live portfolio performance with Recharts
- **🎭 Smooth Animations**: Framer Motion powered transitions
- **🤖 AI Integration**: Risk monitoring, liquidity optimization

---

## 📋 **Summary**

- **`examples/`** = **Learning resource** - "How to use the SDK"
- **`ui/`** = **Development tool** - "Components to build with"  
- **`examples02/`** = **Showcase demos** - "What's possible with the SDK"

The UI package provides the building blocks, while the examples show how to assemble them into complete applications.