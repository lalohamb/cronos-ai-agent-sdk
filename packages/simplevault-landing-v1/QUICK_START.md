# Quick Start Guide - SimpleVault with Dashboard

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies (if needed)
```bash
cd packages/simplevault-landing-v1
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```

### Step 3: Open in Browser
Navigate to: `http://localhost:5173`

---

## 📍 Available Routes

| URL | Page | Description |
|-----|------|-------------|
| `/` | Home | Marketing landing page with vault features |
| `/user-stories` | User Stories | Technical implementation examples |
| `/dashboard` | Dashboard | Interactive AI agent demo |

---

## 🎯 Dashboard Features

### 5 Built-in AI Agents

1. **Risk Monitor** (Deterministic)
   - Monitors risk metrics
   - Recommends protective actions
   - Controls: Risk Threshold, Alert Level, Auto-Execute

2. **Liquidity Optimizer** (Deterministic)
   - Optimizes liquidity allocation
   - Rebalances pools automatically
   - Controls: Target Ratio, Rebalance Frequency, Slippage Tolerance

3. **Emergency Brake** (Deterministic)
   - Triggers emergency stops
   - Circuit breaker for extreme conditions
   - Controls: Emergency Threshold, Cooldown Period, Recovery Mode

4. **Threshold Guard** (Deterministic)
   - Enforces threshold limits
   - Prevents excessive exposure
   - Controls: Max Exposure, Daily Limits, User Limits

5. **Anomaly Detector** (Statistical)
   - Detects unusual patterns
   - Uses statistical analysis
   - Controls: Sensitivity, Learning Period, Alert Threshold

### How to Use Dashboard

1. **Select an Agent**
   - Click on any agent in the left panel
   - Agent details appear on the right

2. **Explore Agent Information**
   - **Explain Tab:** Learn what the agent does
   - **Code Tab:** View implementation details
   - **See in Action Tab:** Try it out!

3. **Execute Agent**
   - Adjust control sliders
   - Click "Execute" button
   - View results in real-time

---

## 🔍 SDK Health Status

### Status Indicator
Look for the colored dot next to "Dashboard" in navigation:
- 🟢 **Green:** SDK is ready and healthy
- ⚫ **Gray:** SDK is initializing or has issues

### Health Checks
The system automatically checks:
1. ✅ SDK Initialization
2. ✅ RPC Health (Cronos Testnet)
3. ✅ Agent Registration (5 agents)
4. ✅ Contract Validation (gas price)

### View Details
Click "View Details" in the dashboard header to see:
- Connection status
- Network information
- Block number
- Gas prices
- Agent registration status

---

## 🛠️ Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run typecheck

# Linting
npm run lint
```

---

## 📁 Project Structure

```
simplevault-landing-v1/
├── src/
│   ├── components/
│   │   ├── AgentDashboard.tsx    ← Dashboard component
│   │   ├── Navigation.tsx         ← Updated with dashboard link
│   │   ├── Hero.tsx
│   │   ├── VaultFeatures.tsx
│   │   ├── AIAgents.tsx
│   │   └── ... (other components)
│   ├── pages/
│   │   ├── HomePage.tsx           ← Updated with SDK status
│   │   └── UserStoriesPage.tsx
│   ├── utils/
│   │   └── sdkHealthChecker.ts    ← SDK health monitoring
│   └── App.tsx                    ← Updated with routes & SDK init
├── DASHBOARD_INTEGRATION.md       ← Technical documentation
├── INTEGRATION_COMPLETE.md        ← Integration summary
├── UI_COMPARISON.md               ← Comparison with exampleboltdemo
└── QUICK_START.md                 ← This file
```

---

## 🎨 Customization

### Change Branding
Edit these files:
- `src/components/Navigation.tsx` - Logo and name
- `src/components/Hero.tsx` - Main headline
- `index.html` - Page title

### Modify Agents
Edit `src/components/AgentDashboard.tsx`:
- Line 36-366: Agent definitions
- Line 19-34: Future agents list

### Update RPC Settings
Edit `src/utils/sdkHealthChecker.ts`:
- Line 16: RPC URL
- Line 18: Contract address
- Line 20: Timeout duration

---

## 🐛 Troubleshooting

### Dashboard Not Loading
1. Check browser console for errors
2. Verify RPC connectivity: `https://evm-t3.cronos.org`
3. Check SDK health status in navigation

### SDK Status Gray
1. Wait for initialization (takes 2-3 seconds)
2. Check internet connection
3. Verify RPC endpoint is accessible
4. Click "View Details" for specific error

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Run type check
npm run typecheck
```

---

## 📚 Documentation

- **Technical Details:** See `DASHBOARD_INTEGRATION.md`
- **Integration Summary:** See `INTEGRATION_COMPLETE.md`
- **UI Comparison:** See `UI_COMPARISON.md`

---

## 🎉 What's Next?

### Try These Features
1. ✅ Execute all 5 agents
2. ✅ Adjust control sliders
3. ✅ View code implementations
4. ✅ Check SDK health details
5. ✅ Test on mobile devices

### Optional Enhancements
- Connect to real SDK (not mock)
- Add custom agents
- Integrate with smart contracts
- Deploy to production

---

**Need Help?** Check the documentation files or review the code comments in `AgentDashboard.tsx`.

