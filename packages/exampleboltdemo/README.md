# 🚀 Cronos AI Agent Live Demo

A production-ready demonstration site showcasing the Cronos AI Agent SDK with interactive agent execution, marketing content, and technical documentation.

## ✨ Features

- **🏠 Marketing Homepage**: Professional landing page with SDK integration status
- **🤖 Live Agent Dashboard**: Interactive demo of all 5 built-in agents
- **📚 Technical Stories**: Comprehensive documentation and use cases
- **🎭 Mock Mode**: Realistic agent simulation without dependencies

## 🛠️ Built With

- **React 18** + **TypeScript**
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Vite** for development

## 🚀 Quick Start

```bash
cd packages/exampleboltdemo
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the demo.

## 📁 Structure

```
exampleboltdemo/
├── src/
│   ├── components/
│   │   ├── AgentDashboard.tsx    # Interactive agent execution
│   │   ├── Navigation.tsx        # Site navigation with status
│   │   └── Hero.tsx             # Landing page hero section
│   ├── pages/
│   │   ├── HomePage.tsx         # Marketing homepage
│   │   └── UserStoriesPage.tsx  # Technical documentation
│   └── App.tsx                  # Main app with routing
```

## 🎯 Demo Features

### **Agent Dashboard** (`/dashboard`)
- **5 Built-in Agents**: Risk Monitor, Liquidity Optimizer, Emergency Brake, Threshold Guard, Anomaly Detector
- **Agent Types**: Deterministic vs Statistical classification
- **Live Execution**: Click to execute agents with mock data
- **Results Display**: JSON formatted results with timestamps
- **Status Indicators**: Real-time connection and execution status

### **Marketing Site** (`/`)
- **Professional Design**: Modern UI with gradients and animations
- **SDK Status**: Live indicator showing agent availability
- **Call-to-Action**: Direct link to live demo dashboard
- **Feature Showcase**: Solutions, pricing, and use cases

### **Technical Stories** (`/user-stories`)
- **Documentation**: Comprehensive technical information
- **Use Cases**: Real-world implementation examples
- **Integration Guide**: How to use the SDK

## 🎭 Mock Mode Benefits

- **No Dependencies**: Runs without SDK build requirements
- **Realistic Demo**: Shows expected UI/UX flow
- **Fast Loading**: Instant initialization
- **Educational**: Perfect for demonstrations and training

## 🔄 Switching to Real SDK

To enable actual SDK integration:
1. Uncomment SDK imports in `App.tsx`
2. Ensure core package builds successfully
3. Replace mock execution with real agent calls

## 🎯 Use Cases

- **Sales Demonstrations**: Show potential customers the SDK capabilities
- **Developer Onboarding**: Help new developers understand the interface
- **UI/UX Testing**: Test interface design without backend dependencies
- **Marketing Material**: Professional showcase for websites and presentations

This demo represents the **gold standard** for SDK integration showcases - combining technical functionality with professional presentation.